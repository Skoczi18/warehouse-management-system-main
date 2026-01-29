from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import case, distinct, func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.audit import AuditLog
from app.models.location import Location
from app.models.product import Product
from app.models.stock import StockPosition
from app.repositories.audit_repo import AuditRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.warehouse_repo import WarehouseRepository
from app.models.warehouse import Warehouse
from app.schemas.warehouse import WarehouseCreate, WarehouseOut, WarehouseUpdate
from app.schemas.warehouse_dashboard import (
    WarehouseDashboardOut,
    WarehouseListOut,
    WarehouseTopProduct,
    WarehouseLowStock,
    WarehouseBlockedLocation,
    WarehouseRecentActivity,
)
from app.schemas.warehouse_stock import (
    StockProductLocationOut,
    StockSummaryOut,
    WarehouseLocationOut,
)
from app.services.audit_service import AuditService

router = APIRouter()

@router.get("", response_model=list[WarehouseListOut])
def list_warehouses(
    q: str | None = Query(default=None),
    sort: str | None = Query(default="name"),
    order: str | None = Query(default="asc"),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    AuditService(AuditRepository(db)).log(
        "VIEW_WAREHOUSES_LIST",
        user.id,
        entity="warehouse",
        details={"q": q, "sort": sort, "order": order},
    )
    db.commit()
    rows = WarehouseRepository(db).list_with_stats(q=q, sort=sort, order=order)
    return [
        WarehouseListOut(
            id=row.id,
            name=row.name,
            locations_count=row.locations_count,
            blocked_locations_count=row.blocked_locations_count,
            sku_count=row.sku_count,
            total_qty=row.total_qty,
            last_activity_at=row.last_activity_at,
        )
        for row in rows
    ]


@router.post("", response_model=WarehouseOut)
def create_warehouse(
    payload: WarehouseCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")
    warehouse = Warehouse(name=payload.name, unit_scale=payload.unit_scale)
    db.add(warehouse)
    AuditService(AuditRepository(db)).log(
        "CREATE_WAREHOUSE",
        user.id,
        entity="warehouse",
        details={"name": payload.name},
    )
    db.commit()
    return warehouse


@router.patch("/{warehouse_id}", response_model=WarehouseOut)
def update_warehouse(
    warehouse_id: int,
    payload: WarehouseUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")
    warehouse = WarehouseRepository(db).by_id(warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    if payload.name is not None:
        warehouse.name = payload.name
    if payload.unit_scale is not None:
        warehouse.unit_scale = payload.unit_scale
    AuditService(AuditRepository(db)).log(
        "UPDATE_WAREHOUSE",
        user.id,
        entity="warehouse",
        entity_id=warehouse_id,
        details={"name": payload.name, "unit_scale": payload.unit_scale},
    )
    db.commit()
    return warehouse


@router.get("/{warehouse_id}/dashboard", response_model=WarehouseDashboardOut)
def warehouse_dashboard(
    warehouse_id: int,
    threshold: int = Query(default=5),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    warehouse = WarehouseRepository(db).by_id(warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    AuditService(AuditRepository(db)).log(
        "VIEW_WAREHOUSE_DASHBOARD",
        user.id,
        entity="warehouse",
        entity_id=warehouse_id,
        details={"threshold": threshold},
    )
    db.commit()

    locations_count = (
        db.query(func.count(Location.id))
        .filter(Location.warehouse_id == warehouse_id)
        .scalar()
        or 0
    )
    blocked_locations_count = (
        db.query(func.count(Location.id))
        .filter(Location.warehouse_id == warehouse_id, Location.is_blocked.is_(True))
        .scalar()
        or 0
    )
    sku_count = (
        db.query(func.count(distinct(StockPosition.product_id)))
        .join(Location, Location.id == StockPosition.location_id)
        .filter(Location.warehouse_id == warehouse_id)
        .scalar()
        or 0
    )
    total_qty = (
        db.query(func.coalesce(func.sum(StockPosition.quantity), 0))
        .join(Location, Location.id == StockPosition.location_id)
        .filter(Location.warehouse_id == warehouse_id)
        .scalar()
        or 0
    )

    top_products_rows = (
        db.query(
            Product.id.label("product_id"),
            Product.sku,
            Product.name,
            func.coalesce(func.sum(StockPosition.quantity), 0).label("qty_total"),
        )
        .join(StockPosition, StockPosition.product_id == Product.id)
        .join(Location, Location.id == StockPosition.location_id)
        .filter(Location.warehouse_id == warehouse_id)
        .group_by(Product.id, Product.sku, Product.name)
        .order_by(func.coalesce(func.sum(StockPosition.quantity), 0).desc())
        .limit(5)
        .all()
    )

    low_stock_rows = (
        db.query(
            Product.id.label("product_id"),
            Product.sku,
            Product.name,
            func.coalesce(func.sum(StockPosition.quantity), 0).label("qty_total"),
        )
        .join(StockPosition, StockPosition.product_id == Product.id)
        .join(Location, Location.id == StockPosition.location_id)
        .filter(Location.warehouse_id == warehouse_id)
        .group_by(Product.id, Product.sku, Product.name)
        .having(func.coalesce(func.sum(StockPosition.quantity), 0) <= threshold)
        .order_by(func.coalesce(func.sum(StockPosition.quantity), 0).asc())
        .limit(10)
        .all()
    )

    blocked_locations_rows = (
        db.query(
            Location.id.label("location_id"),
            Location.code,
            func.count(case((StockPosition.quantity > 0, 1))).label("items_count"),
        )
        .outerjoin(StockPosition, StockPosition.location_id == Location.id)
        .filter(Location.warehouse_id == warehouse_id, Location.is_blocked.is_(True))
        .group_by(Location.id, Location.code)
        .order_by(Location.code.asc())
        .all()
    )

    recent_activity_rows = (
        db.query(AuditLog)
        .filter(AuditLog.entity == "warehouse", AuditLog.entity_id == warehouse_id)
        .order_by(AuditLog.created_at.desc())
        .limit(10)
        .all()
    )

    return WarehouseDashboardOut(
        warehouse={"id": warehouse.id, "name": warehouse.name, "description": None},
        kpis={
            "locations_count": locations_count,
            "blocked_locations_count": blocked_locations_count,
            "sku_count": sku_count,
            "total_qty": total_qty,
        },
        top_products=[
            WarehouseTopProduct(
                product_id=row.product_id,
                sku=row.sku,
                name=row.name,
                qty_total=row.qty_total,
            )
            for row in top_products_rows
        ],
        low_stock=[
            WarehouseLowStock(
                product_id=row.product_id,
                sku=row.sku,
                name=row.name,
                qty_total=row.qty_total,
            )
            for row in low_stock_rows
        ],
        blocked_locations=[
            WarehouseBlockedLocation(
                location_id=row.location_id,
                code=row.code,
                items_count=row.items_count,
            )
            for row in blocked_locations_rows
        ],
        recent_activity=[
            WarehouseRecentActivity(
                at=row.created_at,
                action=row.action,
                user_id=row.user_id,
                entity=row.entity,
                entity_id=row.entity_id,
            )
            for row in recent_activity_rows
        ],
    )


@router.get("/{warehouse_id}/stock/summary")
def stock_summary(
    warehouse_id: int,
    q: str | None = Query(default=None),
    sort: str | None = Query(default="qty"),
    order: str | None = Query(default="desc"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    if not WarehouseRepository(db).by_id(warehouse_id):
        raise HTTPException(status_code=404, detail="Warehouse not found")

    query = (
        db.query(
            Product.id.label("product_id"),
            Product.sku,
            Product.name,
            func.coalesce(func.sum(StockPosition.quantity), 0).label("qty_total"),
        )
        .join(StockPosition, StockPosition.product_id == Product.id)
        .join(Location, Location.id == StockPosition.location_id)
        .filter(Location.warehouse_id == warehouse_id)
        .group_by(Product.id, Product.sku, Product.name)
    )
    if q:
        query = query.filter(
            (Product.sku.ilike(f"%{q}%")) | (Product.name.ilike(f"%{q}%"))
        )

    sort_col = func.coalesce(func.sum(StockPosition.quantity), 0)
    if sort == "name":
        sort_col = Product.name
    if (order or "desc").lower() == "asc":
        query = query.order_by(sort_col.asc())
    else:
        query = query.order_by(sort_col.desc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return {
        "items": [
            StockSummaryOut(
                product_id=row.product_id,
                sku=row.sku,
                name=row.name,
                qty_total=row.qty_total,
            )
            for row in items
        ],
        "page": page,
        "page_size": page_size,
        "total": total,
    }


@router.get("/{warehouse_id}/stock/product/{product_id}", response_model=list[StockProductLocationOut])
def stock_product_locations(
    warehouse_id: int,
    product_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    if not WarehouseRepository(db).by_id(warehouse_id):
        raise HTTPException(status_code=404, detail="Warehouse not found")
    if not ProductRepository(db).by_id(product_id):
        raise HTTPException(status_code=404, detail="Product not found")

    rows = (
        db.query(
            Location.id.label("location_id"),
            Location.code,
            StockPosition.quantity,
            Location.is_blocked,
        )
        .join(StockPosition, StockPosition.location_id == Location.id)
        .filter(Location.warehouse_id == warehouse_id, StockPosition.product_id == product_id)
        .order_by(Location.code.asc())
        .all()
    )
    return [
        StockProductLocationOut(
            location_id=row.location_id,
            code=row.code,
            quantity=row.quantity,
            is_blocked=row.is_blocked,
        )
        for row in rows
    ]


@router.get("/{warehouse_id}/locations", response_model=list[WarehouseLocationOut])
def list_locations(
    warehouse_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    if not WarehouseRepository(db).by_id(warehouse_id):
        raise HTTPException(status_code=404, detail="Warehouse not found")
    rows = (
        db.query(
            Location.id.label("location_id"),
            Location.code,
            Location.description,
            Location.is_blocked,
            func.count(case((StockPosition.quantity > 0, 1))).label("items_count"),
        )
        .outerjoin(StockPosition, StockPosition.location_id == Location.id)
        .filter(Location.warehouse_id == warehouse_id)
        .group_by(Location.id, Location.code, Location.description, Location.is_blocked)
        .order_by(Location.code.asc())
        .all()
    )

    location_ids = [row.location_id for row in rows]
    previews: dict[int, list[str]] = {loc_id: [] for loc_id in location_ids}
    if location_ids:
        preview_rows = (
            db.query(
                StockPosition.location_id,
                Product.sku,
            )
            .join(Product, Product.id == StockPosition.product_id)
            .filter(
                StockPosition.location_id.in_(location_ids),
                StockPosition.quantity > 0,
            )
            .order_by(StockPosition.location_id.asc(), StockPosition.quantity.desc())
            .all()
        )
        for row in preview_rows:
            if len(previews[row.location_id]) < 3:
                previews[row.location_id].append(row.sku)

    def status_for(row):
        if row.is_blocked:
            return "BLOCKED"
        if row.items_count > 0:
            return "OCCUPIED"
        return "FREE"

    return [
        WarehouseLocationOut(
            location_id=row.location_id,
            code=row.code,
            description=row.description,
            status=status_for(row),
            items_count=row.items_count,
            items_preview=previews.get(row.location_id, []),
        )
        for row in rows
    ]

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.location_repo import LocationRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.stock_repo import StockRepository
from app.schemas.stock import StockOut, StockTransferRequest
from app.services.audit_service import AuditService
from app.services.inventory_service import InventoryService

router = APIRouter()


@router.get("", response_model=list[StockOut])
def list_stock(
    warehouse_id: int | None = Query(default=None),
    product_id: int | None = Query(default=None),
    location_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    service = InventoryService(StockRepository(db))
    return service.list_stock(
        warehouse_id=warehouse_id,
        product_id=product_id,
        location_id=location_id,
    )


@router.post("/transfer")
def transfer_stock(
    payload: StockTransferRequest,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.MAGAZYNIER, UserRole.KIEROWNIK)),
):
    products_repo = ProductRepository(db)
    if not products_repo.by_id(payload.product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    locations_repo = LocationRepository(db)
    from_location = locations_repo.by_id(payload.from_location_id)
    to_location = locations_repo.by_id(payload.to_location_id)
    if not from_location or not to_location:
        raise HTTPException(status_code=404, detail="Location not found")
    if from_location.is_blocked or to_location.is_blocked:
        raise HTTPException(status_code=400, detail="Location blocked")

    service = InventoryService(StockRepository(db))
    try:
        source, target = service.transfer_stock(
            product_id=payload.product_id,
            from_location_id=payload.from_location_id,
            to_location_id=payload.to_location_id,
            qty=payload.qty,
        )
        AuditService(AuditRepository(db)).log(
            "TRANSFER_STOCK",
            user.id,
            entity="stock",
            entity_id=source.id,
            details={
                "product_id": payload.product_id,
                "from_location_id": payload.from_location_id,
                "to_location_id": payload.to_location_id,
                "qty": payload.qty,
            },
        )
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))

    return {
        "from": StockOut.model_validate(source),
        "to": StockOut.model_validate(target),
    }

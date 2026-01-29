from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.delivery import DeliveryStatus
from app.models.user import UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.delivery_repo import DeliveryRepository
from app.repositories.location_repo import LocationRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.stock_repo import StockRepository
from app.repositories.supplier_repo import SupplierRepository
from app.schemas.delivery import DeliveryCreate, DeliveryOut, DeliveryPutawayRequest
from app.services.audit_service import AuditService
from app.services.delivery_service import DeliveryService
from app.services.inventory_service import InventoryService

router = APIRouter()


@router.get("", response_model=list[DeliveryOut])
def list_deliveries(
    status: DeliveryStatus | None = Query(default=None),
    supplier_id: int | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    deliveries = DeliveryRepository(db).list(
        status=status,
        supplier_id=supplier_id,
        date_from=date_from,
        date_to=date_to,
    )
    return [DeliveryOut.model_validate(d) for d in deliveries]


@router.get("/{delivery_id}", response_model=DeliveryOut)
def get_delivery(
    delivery_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    repo = DeliveryRepository(db)
    delivery = repo.by_id(delivery_id)
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    items = repo.list_items(delivery_id)
    out = DeliveryOut.model_validate(delivery)
    out.items = items
    return out


@router.post("", response_model=DeliveryOut)
def create_delivery(
    payload: DeliveryCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.MAGAZYNIER, UserRole.KIEROWNIK)),
):
    service = DeliveryService(
        deliveries_repo=DeliveryRepository(db),
        products_repo=ProductRepository(db),
        locations_repo=LocationRepository(db),
        suppliers_repo=SupplierRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    try:
        delivery = service.create_delivery(payload, user.id)
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    return DeliveryOut.model_validate(delivery)


@router.post("/{delivery_id}/cancel", response_model=DeliveryOut)
def cancel_delivery(
    delivery_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK)),
):
    repo = DeliveryRepository(db)
    delivery = repo.by_id(delivery_id)
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")

    service = DeliveryService(
        deliveries_repo=repo,
        products_repo=ProductRepository(db),
        locations_repo=LocationRepository(db),
        suppliers_repo=SupplierRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    try:
        delivery = service.cancel_delivery(delivery, user.id)
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    return DeliveryOut.model_validate(delivery)


@router.post("/{delivery_id}/putaway", response_model=DeliveryOut)
def putaway_delivery(
    delivery_id: int,
    payload: DeliveryPutawayRequest,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.MAGAZYNIER, UserRole.KIEROWNIK)),
):
    repo = DeliveryRepository(db)
    delivery = repo.by_id(delivery_id)
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    service = DeliveryService(
        deliveries_repo=repo,
        products_repo=ProductRepository(db),
        locations_repo=LocationRepository(db),
        suppliers_repo=SupplierRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    try:
        delivery = service.putaway_delivery(delivery, payload.items, user.id)
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    return DeliveryOut.model_validate(delivery)

from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.delivery_repo import DeliveryRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.stock_repo import StockRepository
from app.schemas.audit import AuditOut
from app.schemas.delivery import DeliveryOut
from app.schemas.order import OrderOut
from app.schemas.stock import StockOut
from app.services.inventory_service import InventoryService

router = APIRouter()


@router.get("/stock", response_model=list[StockOut])
def report_stock(
    warehouse_id: int | None = Query(default=None),
    product_id: int | None = Query(default=None),
    location_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    service = InventoryService(StockRepository(db))
    return service.list_stock(
        warehouse_id=warehouse_id,
        product_id=product_id,
        location_id=location_id,
    )


@router.get("/deliveries", response_model=list[DeliveryOut])
def report_deliveries(
    status: str | None = Query(default=None),
    supplier_id: int | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    deliveries = DeliveryRepository(db).list(
        status=status,
        supplier_id=supplier_id,
        date_from=date_from,
        date_to=date_to,
    )
    return [DeliveryOut.model_validate(d) for d in deliveries]


@router.get("/orders", response_model=list[OrderOut])
def report_orders(
    status: str | None = Query(default=None),
    customer_id: int | None = Query(default=None),
    priority: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    orders = OrderRepository(db).list(status=status, customer_id=customer_id, priority=priority)
    return [OrderOut.model_validate(o) for o in orders]


@router.get("/audit", response_model=list[AuditOut])
def report_audit(
    action: str | None = Query(default=None),
    user_id: int | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Admin can see all; manager sees only own entries.
    if user.role == UserRole.ADMIN:
        entries = AuditRepository(db).list(action, user_id, date_from, date_to)
    else:
        entries = AuditRepository(db).list(action, user.id, date_from, date_to)
    return [AuditOut.model_validate(entry) for entry in entries]

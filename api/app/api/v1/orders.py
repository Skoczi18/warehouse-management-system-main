from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.order import OrderStatus
from app.models.user import UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.customer_repo import CustomerRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.stock_repo import StockRepository
from app.schemas.order import OrderCreate, OrderOut, OrderPriorityUpdate, OrderStatusUpdate, OrderUpdate
from app.schemas.order_summary import OrderSummaryOut, OrderItemSummary
from app.services.audit_service import AuditService
from app.services.inventory_service import InventoryService
from app.services.order_service import OrderService

router = APIRouter()


@router.get("", response_model=list[OrderOut])
def list_orders(
    status: OrderStatus | None = Query(default=None),
    customer_id: int | None = Query(default=None),
    priority: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    orders = OrderRepository(db).list(status=status, customer_id=customer_id, priority=priority)
    return [OrderOut.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    repo = OrderRepository(db)
    order = repo.by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items = repo.list_items(order_id)
    out = OrderOut.model_validate(order)
    out.items = items
    return out


@router.get("/{order_id}/summary", response_model=OrderSummaryOut)
def get_order_summary(
    order_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    repo = OrderRepository(db)
    order = repo.by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items = repo.list_items(order_id)
    products_repo = ProductRepository(db)
    inventory_service = InventoryService(StockRepository(db))

    summary_items: list[OrderItemSummary] = []
    for item in items:
        product = products_repo.by_id(item.product_id)
        available = inventory_service.get_available(item.product_id)
        remaining = max(0, item.qty_ordered - item.qty_issued)
        missing = max(0, remaining - available)
        summary_items.append(
            OrderItemSummary(
                product_id=item.product_id,
                sku=product.sku if product else str(item.product_id),
                name=product.name if product else "UNKNOWN",
                qty_ordered=item.qty_ordered,
                qty_issued=item.qty_issued,
                qty_remaining=remaining,
                available=available,
                missing=missing,
                can_fulfill=available >= remaining,
            )
        )

    return OrderSummaryOut(
        order_id=order.id,
        order_no=order.order_no,
        status=order.status,
        priority=order.priority,
        items=summary_items,
    )


@router.post("", response_model=OrderOut)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    service = OrderService(
        orders_repo=OrderRepository(db),
        customers_repo=CustomerRepository(db),
        products_repo=ProductRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    try:
        order = service.create_order(payload, user.id)
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    return OrderOut.model_validate(order)


@router.patch("/{order_id}/priority", response_model=OrderOut)
def update_priority(
    order_id: int,
    payload: OrderPriorityUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK)),
):
    repo = OrderRepository(db)
    order = repo.by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    service = OrderService(
        orders_repo=repo,
        customers_repo=CustomerRepository(db),
        products_repo=ProductRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    order = service.update_priority(order, payload.priority, user.id)
    db.commit()
    return OrderOut.model_validate(order)


@router.patch("/{order_id}/status", response_model=OrderOut)
def update_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    repo = OrderRepository(db)
    order = repo.by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    service = OrderService(
        orders_repo=repo,
        customers_repo=CustomerRepository(db),
        products_repo=ProductRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    order = service.update_status(order, payload.status, user.id)
    db.commit()
    return OrderOut.model_validate(order)


@router.patch("/{order_id}", response_model=OrderOut)
def update_order(
    order_id: int,
    payload: OrderUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN)),
):
    repo = OrderRepository(db)
    order = repo.by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    service = OrderService(
        orders_repo=repo,
        customers_repo=CustomerRepository(db),
        products_repo=ProductRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    if payload.order_no:
        order = service.update_order_no(order, payload.order_no, user.id)
    db.commit()
    return OrderOut.model_validate(order)


@router.post("/{order_id}/issue", response_model=OrderOut)
def issue_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.MAGAZYNIER, UserRole.KIEROWNIK)),
):
    repo = OrderRepository(db)
    order = repo.by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items = repo.list_items(order_id)

    service = OrderService(
        orders_repo=repo,
        customers_repo=CustomerRepository(db),
        products_repo=ProductRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    try:
        order = service.issue_order(order, items, user.id)
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    out = OrderOut.model_validate(order)
    out.items = items
    return out


@router.post("/{order_id}/cancel", response_model=OrderOut)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK)),
):
    repo = OrderRepository(db)
    order = repo.by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    service = OrderService(
        orders_repo=repo,
        customers_repo=CustomerRepository(db),
        products_repo=ProductRepository(db),
        inventory_service=InventoryService(StockRepository(db)),
        audit_service=AuditService(AuditRepository(db)),
    )
    try:
        order = service.cancel_order(order, user.id)
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    return OrderOut.model_validate(order)

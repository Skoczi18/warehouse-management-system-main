from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem


class OrderService:
    def __init__(self, orders_repo, customers_repo, products_repo, inventory_service, audit_service):
        self.orders_repo = orders_repo
        self.customers_repo = customers_repo
        self.products_repo = products_repo
        self.inventory_service = inventory_service
        self.audit_service = audit_service

    def create_order(self, payload, user_id: int):
        customer = self.customers_repo.by_id(payload.customer_id)
        if not customer:
            raise ValueError("Customer not found")
        if not payload.items:
            raise ValueError("Order items required")

        order = Order(
            order_no=payload.order_no,
            customer_id=payload.customer_id,
            priority=payload.priority,
            status=OrderStatus.NOWE,
        )
        self.orders_repo.create(order)
        self.orders_repo.flush()

        for item in payload.items:
            if item.qty <= 0:
                raise ValueError("Item quantity must be positive")
            product = self.products_repo.by_sku(item.sku)
            if not product:
                raise ValueError(f"Product not found for SKU: {item.sku}")
            self.orders_repo.add_item(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    qty_ordered=item.qty,
                    qty_issued=0,
                )
            )

        self.audit_service.log(
            "CREATE_ORDER",
            user_id,
            entity="order",
            entity_id=order.id,
            details={"order_no": payload.order_no},
        )
        return order

    def update_priority(self, order: Order, priority: bool, user_id: int):
        order.priority = priority
        self.audit_service.log(
            "UPDATE_PRIORITY",
            user_id,
            entity="order",
            entity_id=order.id,
            details={"priority": priority},
        )
        return order

    def update_status(self, order: Order, status: OrderStatus, user_id: int):
        order.status = status
        self.audit_service.log(
            "UPDATE_STATUS",
            user_id,
            entity="order",
            entity_id=order.id,
            details={"status": status.value},
        )
        return order

    def update_order_no(self, order: Order, order_no: str, user_id: int):
        if order.order_no != order_no:
            order.order_no = order_no
            self.audit_service.log(
                "UPDATE_ORDER_NO",
                user_id,
                entity="order",
                entity_id=order.id,
                details={"order_no": order_no},
            )
        return order

    def cancel_order(self, order: Order, user_id: int):
        if order.status == OrderStatus.ANULOWANE:
            raise ValueError("Order already canceled")
        if order.status == OrderStatus.ZREALIZOWANE:
            raise ValueError("Order already completed")
        order.status = OrderStatus.ANULOWANE
        self.audit_service.log(
            "CANCEL_ORDER",
            user_id,
            entity="order",
            entity_id=order.id,
        )
        return order

    def issue_order(self, order: Order, items: list[OrderItem], user_id: int):
        if order.status == OrderStatus.ANULOWANE:
            raise ValueError("Order canceled")
        if order.status == OrderStatus.ZREALIZOWANE:
            raise ValueError("Order already completed")

        issued_any = False
        for item in items:
            remaining = item.qty_ordered - item.qty_issued
            if remaining <= 0:
                continue
            self.inventory_service.decrease_stock(item.product_id, remaining)
            item.qty_issued += remaining
            issued_any = True

        if not issued_any:
            order.status = OrderStatus.OCZEKUJACE
        else:
            all_done = all(i.qty_issued >= i.qty_ordered for i in items)
            order.status = (
                OrderStatus.ZREALIZOWANE if all_done else OrderStatus.ZREALIZOWANE_CZESCIOWO
            )

        self.audit_service.log(
            "ISSUE_ORDER",
            user_id,
            entity="order",
            entity_id=order.id,
            details={"status": order.status.value},
        )
        return order

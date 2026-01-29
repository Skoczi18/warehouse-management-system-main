from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.order_item import OrderItem


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, order: Order):
        self.db.add(order)
        return order

    def add_item(self, item: OrderItem):
        self.db.add(item)
        return item

    def flush(self):
        self.db.flush()

    def by_id(self, order_id: int):
        return self.db.query(Order).filter_by(id=order_id).first()

    def list(self, status, customer_id: int | None, priority: bool | None):
        query = self.db.query(Order)
        if status:
            query = query.filter(Order.status == status)
        if customer_id:
            query = query.filter(Order.customer_id == customer_id)
        if priority is not None:
            query = query.filter(Order.priority == priority)
        return query.order_by(Order.created_at.desc()).all()

    def list_items(self, order_id: int):
        return self.db.query(OrderItem).filter_by(order_id=order_id).all()

from sqlalchemy.orm import Session

from app.models.delivery import Delivery, DeliveryStatus
from app.models.delivery_item import DeliveryItem


class DeliveryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, delivery: Delivery):
        self.db.add(delivery)
        return delivery

    def flush(self):
        self.db.flush()

    def add_item(self, item: DeliveryItem):
        self.db.add(item)
        return item

    def by_id(self, delivery_id: int):
        return self.db.query(Delivery).filter_by(id=delivery_id).first()

    def list(self, status: DeliveryStatus | None, supplier_id: int | None, date_from, date_to):
        query = self.db.query(Delivery)
        if status:
            query = query.filter(Delivery.status == status)
        if supplier_id:
            query = query.filter(Delivery.supplier_id == supplier_id)
        if date_from:
            query = query.filter(Delivery.created_at >= date_from)
        if date_to:
            query = query.filter(Delivery.created_at <= date_to)
        return query.order_by(Delivery.created_at.desc()).all()

    def list_items(self, delivery_id: int):
        return self.db.query(DeliveryItem).filter_by(delivery_id=delivery_id).all()

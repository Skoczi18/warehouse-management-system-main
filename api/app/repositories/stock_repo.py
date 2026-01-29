from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.location import Location
from app.models.stock import StockPosition


class StockRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, warehouse_id: int | None, product_id: int | None, location_id: int | None):
        query = self.db.query(StockPosition)
        if product_id:
            query = query.filter(StockPosition.product_id == product_id)
        if location_id:
            query = query.filter(StockPosition.location_id == location_id)
        if warehouse_id:
            query = query.join(Location, StockPosition.location_id == Location.id)
            query = query.filter(Location.warehouse_id == warehouse_id)
        return query.order_by(StockPosition.id).all()

    def get_by_product_location(self, product_id: int, location_id: int):
        return (
            self.db.query(StockPosition)
            .filter_by(product_id=product_id, location_id=location_id)
            .first()
        )

    def positions_for_decrease(self, product_id: int, warehouse_id: int | None = None):
        query = self.db.query(StockPosition).filter(StockPosition.product_id == product_id)
        query = query.filter(StockPosition.quantity > 0)
        if warehouse_id:
            query = query.join(Location, StockPosition.location_id == Location.id)
            query = query.filter(Location.warehouse_id == warehouse_id)
        return query.order_by(StockPosition.quantity.desc()).all()

    def available(self, product_id: int, warehouse_id: int | None = None) -> int:
        query = self.db.query(func.coalesce(func.sum(StockPosition.quantity), 0))
        query = query.filter(StockPosition.product_id == product_id)
        if warehouse_id:
            query = query.join(Location, StockPosition.location_id == Location.id)
            query = query.filter(Location.warehouse_id == warehouse_id)
        return int(query.scalar() or 0)

    def save(self, position: StockPosition):
        self.db.add(position)
        return position

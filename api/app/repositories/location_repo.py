from sqlalchemy.orm import Session

from app.models.location import Location


class LocationRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_by_warehouse(self, warehouse_id: int):
        return (
            self.db.query(Location)
            .filter_by(warehouse_id=warehouse_id)
            .order_by(Location.id)
            .all()
        )

    def list(self, warehouse_id: int | None = None, code: str | None = None):
        query = self.db.query(Location)
        if warehouse_id:
            query = query.filter_by(warehouse_id=warehouse_id)
        if code:
            query = query.filter(Location.code.ilike(f"%{code}%"))
        return query.order_by(Location.code).all()

    def by_id(self, location_id: int):
        return self.db.query(Location).filter_by(id=location_id).first()

    def by_code(self, code: str):
        return self.db.query(Location).filter_by(code=code).all()

    def by_code_in_warehouse(self, code: str, warehouse_id: int):
        return (
            self.db.query(Location)
            .filter_by(code=code, warehouse_id=warehouse_id)
            .all()
        )

    def save(self, location: Location):
        self.db.add(location)
        return location

    def delete(self, location: Location):
        self.db.delete(location)

    def flush(self):
        self.db.flush()

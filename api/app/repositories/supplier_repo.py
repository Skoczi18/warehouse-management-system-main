from sqlalchemy.orm import Session

from app.models.supplier import Supplier


class SupplierRepository:
    def __init__(self, db: Session):
        self.db = db

    def by_id(self, supplier_id: int):
        return self.db.query(Supplier).filter_by(id=supplier_id).first()

    def list(self, search: str | None = None):
        query = self.db.query(Supplier)
        if search:
            query = query.filter(Supplier.name.ilike(f"%{search}%"))
        return query.order_by(Supplier.name).all()

    def create(self, supplier: Supplier):
        self.db.add(supplier)
        return supplier

    def delete(self, supplier: Supplier):
        self.db.delete(supplier)

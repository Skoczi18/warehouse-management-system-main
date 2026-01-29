from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.product import Product


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, search: str | None = None):
        query = self.db.query(Product)
        if search:
            like = f"%{search}%"
            query = query.filter(or_(Product.sku.ilike(like), Product.name.ilike(like)))
        return query.order_by(Product.id).all()

    def by_id(self, product_id: int):
        return self.db.query(Product).filter_by(id=product_id).first()

    def by_sku(self, sku: str):
        return self.db.query(Product).filter_by(sku=sku).first()

    def create(self, product: Product):
        self.db.add(product)
        return product

    def delete(self, product: Product):
        self.db.delete(product)

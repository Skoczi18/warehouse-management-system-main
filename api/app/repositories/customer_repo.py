from sqlalchemy.orm import Session

from app.models.customer import Customer


class CustomerRepository:
    def __init__(self, db: Session):
        self.db = db

    def by_id(self, customer_id: int):
        return self.db.query(Customer).filter_by(id=customer_id).first()

    def list(self, search: str | None = None):
        query = self.db.query(Customer)
        if search:
            query = query.filter(Customer.name.ilike(f"%{search}%"))
        return query.order_by(Customer.name).all()

    def create(self, customer: Customer):
        self.db.add(customer)
        return customer

    def delete(self, customer: Customer):
        self.db.delete(customer)

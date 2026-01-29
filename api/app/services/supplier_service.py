from app.models.supplier import Supplier


class SupplierService:
    def __init__(self, repo):
        self.repo = repo

    def create(self, payload):
        supplier = Supplier(
            name=payload.name,
            contact_data=payload.contact_data,
        )
        return self.repo.create(supplier)

    def update(self, supplier: Supplier, payload):
        if payload.name is not None:
            supplier.name = payload.name
        if payload.contact_data is not None:
            supplier.contact_data = payload.contact_data
        return supplier

    def delete(self, supplier: Supplier):
        self.repo.delete(supplier)

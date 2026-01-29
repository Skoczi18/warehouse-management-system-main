from app.models.product import Product


class ProductService:
    def __init__(self, repo):
        self.repo = repo

    def list(self, search: str | None = None):
        return self.repo.list(search=search)

    def create(self, payload):
        product = Product(
            sku=payload.sku,
            name=payload.name,
            type=payload.type,
            brand=payload.brand,
            model=payload.model,
        )
        return self.repo.create(product)

    def update(self, product_id: int, payload):
        product = self.repo.by_id(product_id)
        if not product:
            return None
        for field in ["sku", "name", "type", "brand", "model"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(product, field, value)
        return product

    def delete(self, product_id: int):
        product = self.repo.by_id(product_id)
        if not product:
            return None
        self.repo.delete(product)
        return product

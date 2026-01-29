from app.models.stock import StockPosition


class InventoryService:
    def __init__(self, stock_repo):
        self.stock_repo = stock_repo

    def increase_stock(self, product_id: int, location_id: int, qty: int):
        if qty <= 0:
            raise ValueError("Quantity must be positive")
        position = self.stock_repo.get_by_product_location(product_id, location_id)
        if not position:
            position = StockPosition(
                product_id=product_id,
                location_id=location_id,
                quantity=qty,
            )
            return self.stock_repo.save(position)
        position.quantity += qty
        return position

    def decrease_stock(self, product_id: int, qty: int, warehouse_id: int | None = None):
        if qty <= 0:
            raise ValueError("Quantity must be positive")
        positions = self.stock_repo.positions_for_decrease(product_id, warehouse_id=warehouse_id)
        remaining = qty
        for position in positions:
            if remaining <= 0:
                break
            take = min(position.quantity, remaining)
            position.quantity -= take
            remaining -= take
        if remaining > 0:
            raise ValueError("Insufficient stock")
        return qty

    def get_available(self, product_id: int, warehouse_id: int | None = None) -> int:
        return self.stock_repo.available(product_id, warehouse_id=warehouse_id)

    def list_stock(self, warehouse_id: int | None, product_id: int | None, location_id: int | None):
        return self.stock_repo.list(
            warehouse_id=warehouse_id,
            product_id=product_id,
            location_id=location_id,
        )

    def transfer_stock(self, product_id: int, from_location_id: int, to_location_id: int, qty: int):
        if qty <= 0:
            raise ValueError("Quantity must be positive")
        if from_location_id == to_location_id:
            raise ValueError("Locations must be different")
        source = self.stock_repo.get_by_product_location(product_id, from_location_id)
        if not source or source.quantity < qty:
            raise ValueError("Insufficient stock in source location")
        source.quantity -= qty
        target = self.stock_repo.get_by_product_location(product_id, to_location_id)
        if not target:
            target = StockPosition(
                product_id=product_id,
                location_id=to_location_id,
                quantity=qty,
            )
            self.stock_repo.save(target)
        else:
            target.quantity += qty
        return source, target

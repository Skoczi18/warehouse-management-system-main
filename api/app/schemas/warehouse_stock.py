from pydantic import BaseModel


class StockSummaryOut(BaseModel):
    product_id: int
    sku: str
    name: str
    qty_total: int


class StockProductLocationOut(BaseModel):
    location_id: int
    code: str
    quantity: int
    is_blocked: bool


class WarehouseLocationOut(BaseModel):
    location_id: int
    code: str
    description: str | None
    status: str
    items_count: int
    items_preview: list[str]

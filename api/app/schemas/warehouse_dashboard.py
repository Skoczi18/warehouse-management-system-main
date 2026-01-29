from datetime import datetime

from pydantic import BaseModel


class WarehouseListOut(BaseModel):
    id: int
    name: str
    locations_count: int
    blocked_locations_count: int
    sku_count: int
    total_qty: int
    last_activity_at: datetime | None

    model_config = {"from_attributes": True}


class WarehouseKpis(BaseModel):
    locations_count: int
    blocked_locations_count: int
    sku_count: int
    total_qty: int


class WarehouseTopProduct(BaseModel):
    product_id: int
    sku: str
    name: str
    qty_total: int


class WarehouseLowStock(BaseModel):
    product_id: int
    sku: str
    name: str
    qty_total: int


class WarehouseBlockedLocation(BaseModel):
    location_id: int
    code: str
    items_count: int


class WarehouseRecentActivity(BaseModel):
    at: datetime
    action: str
    user_id: int | None
    entity: str | None
    entity_id: int | None


class WarehouseDashboardOut(BaseModel):
    warehouse: dict
    kpis: WarehouseKpis
    top_products: list[WarehouseTopProduct]
    low_stock: list[WarehouseLowStock]
    blocked_locations: list[WarehouseBlockedLocation]
    recent_activity: list[WarehouseRecentActivity]

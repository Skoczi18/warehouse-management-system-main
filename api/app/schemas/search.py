from pydantic import BaseModel


class SearchItem(BaseModel):
    id: int
    label: str
    kind: str


class SearchResponse(BaseModel):
    products: list[SearchItem]
    orders: list[SearchItem]
    locations: list[SearchItem]
    customers: list[SearchItem]
    suppliers: list[SearchItem]
    deliveries: list[SearchItem]

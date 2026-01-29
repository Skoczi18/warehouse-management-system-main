from pydantic import BaseModel


class StockOut(BaseModel):
    id: int
    product_id: int
    location_id: int
    quantity: int

    model_config = {"from_attributes": True}


class StockTransferRequest(BaseModel):
    product_id: int
    from_location_id: int
    to_location_id: int
    qty: int

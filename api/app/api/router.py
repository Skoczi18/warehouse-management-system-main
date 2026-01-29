from fastapi import APIRouter
from app.api.v1 import auth, admin, debug, health, products, warehouses, locations, stock, deliveries, orders, reports, customers, suppliers, layout_locks, search

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"]
)

api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"]
)


api_router.include_router(debug.router, prefix="/debug", tags=["debug"])

api_router.include_router(health.router, tags=["health"])

api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(warehouses.router, prefix="/warehouses", tags=["warehouses"])
api_router.include_router(layout_locks.router, prefix="/warehouses", tags=["layout-locks"])
api_router.include_router(locations.router, prefix="/locations", tags=["locations"])
api_router.include_router(stock.router, prefix="/stock", tags=["stock"])
api_router.include_router(deliveries.router, prefix="/deliveries", tags=["deliveries"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])
api_router.include_router(search.router, prefix="/search", tags=["search"])

from sqlalchemy.orm import Session

from app.models.warehouse import Warehouse
from app.models.location import Location
from app.models.stock import StockPosition
from app.models.audit import AuditLog
from sqlalchemy import case, distinct, func


class WarehouseRepository:
    def __init__(self, db: Session):
        self.db = db

    def by_id(self, warehouse_id: int):
        return self.db.query(Warehouse).filter_by(id=warehouse_id).first()

    def list(self):
        return self.db.query(Warehouse).order_by(Warehouse.id).all()

    def list_with_stats(self, q: str | None, sort: str | None, order: str | None):
        loc_stats = (
            self.db.query(
                Location.warehouse_id.label("warehouse_id"),
                func.count(Location.id).label("locations_count"),
                func.sum(case((Location.is_blocked.is_(True), 1), else_=0)).label(
                    "blocked_locations_count"
                ),
            )
            .group_by(Location.warehouse_id)
            .subquery()
        )
        stock_stats = (
            self.db.query(
                Location.warehouse_id.label("warehouse_id"),
                func.count(distinct(StockPosition.product_id)).label("sku_count"),
                func.coalesce(func.sum(StockPosition.quantity), 0).label("total_qty"),
            )
            .join(Location, Location.id == StockPosition.location_id)
            .group_by(Location.warehouse_id)
            .subquery()
        )
        audit_stats = (
            self.db.query(
                AuditLog.entity_id.label("warehouse_id"),
                func.max(AuditLog.created_at).label("last_activity_at"),
            )
            .filter(AuditLog.entity == "warehouse")
            .group_by(AuditLog.entity_id)
            .subquery()
        )

        query = (
            self.db.query(
                Warehouse.id,
                Warehouse.name,
                func.coalesce(loc_stats.c.locations_count, 0).label("locations_count"),
                func.coalesce(loc_stats.c.blocked_locations_count, 0).label(
                    "blocked_locations_count"
                ),
                func.coalesce(stock_stats.c.sku_count, 0).label("sku_count"),
                func.coalesce(stock_stats.c.total_qty, 0).label("total_qty"),
                audit_stats.c.last_activity_at.label("last_activity_at"),
            )
            .outerjoin(loc_stats, loc_stats.c.warehouse_id == Warehouse.id)
            .outerjoin(stock_stats, stock_stats.c.warehouse_id == Warehouse.id)
            .outerjoin(audit_stats, audit_stats.c.warehouse_id == Warehouse.id)
        )

        if q:
            query = query.filter(Warehouse.name.ilike(f"%{q}%"))

        sort_map = {
            "name": Warehouse.name,
            "total_qty": func.coalesce(stock_stats.c.total_qty, 0),
            "last_activity": audit_stats.c.last_activity_at,
        }
        sort_col = sort_map.get(sort or "name", Warehouse.name)
        if (order or "asc").lower() == "desc":
            sort_col = sort_col.desc()
        else:
            sort_col = sort_col.asc()
        query = query.order_by(sort_col)

        return query.all()

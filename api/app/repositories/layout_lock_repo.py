from datetime import datetime, timedelta
import uuid

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models.layout_lock import LayoutLock


class LayoutLockRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, warehouse_id: int):
        return self.db.query(LayoutLock).filter_by(warehouse_id=warehouse_id).first()

    def create(self, warehouse_id: int, locked_by: int, ttl_seconds: int):
        lock = LayoutLock(
            warehouse_id=warehouse_id,
            lock_id=uuid.uuid4(),
            locked_by=locked_by,
            expires_at=datetime.utcnow() + timedelta(seconds=ttl_seconds),
        )
        self.db.add(lock)
        return lock

    def update(self, lock: LayoutLock, ttl_seconds: int):
        lock.expires_at = datetime.utcnow() + timedelta(seconds=ttl_seconds)
        return lock

    def delete(self, warehouse_id: int):
        self.db.execute(delete(LayoutLock).where(LayoutLock.warehouse_id == warehouse_id))

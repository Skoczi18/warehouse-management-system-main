from datetime import datetime, timedelta
import uuid

from app.models.layout_lock import LayoutLock


class LayoutLockService:
    def __init__(self, repo):
        self.repo = repo

    def get_lock(self, warehouse_id: int):
        lock = self.repo.get(warehouse_id)
        if lock and lock.expires_at < datetime.utcnow():
            return None
        return lock

    def acquire_lock(self, warehouse_id: int, user_id: int, ttl_seconds: int):
        lock = self.repo.get(warehouse_id)
        now = datetime.utcnow()
        if lock and lock.expires_at >= now and lock.locked_by != user_id:
            raise ValueError("Lock already held")
        if lock and lock.locked_by == user_id:
            lock.expires_at = now + timedelta(seconds=ttl_seconds)
            return lock
        if lock and lock.expires_at < now:
            self.repo.delete(warehouse_id)
        return self.repo.create(warehouse_id, user_id, ttl_seconds)

    def refresh_lock(self, warehouse_id: int, lock_id: uuid.UUID, user_id: int, ttl_seconds: int):
        lock = self.repo.get(warehouse_id)
        if not lock or lock.expires_at < datetime.utcnow():
            raise ValueError("Lock not found")
        if lock.lock_id != lock_id or lock.locked_by != user_id:
            raise ValueError("Invalid lock")
        lock.expires_at = datetime.utcnow() + timedelta(seconds=ttl_seconds)
        return lock

    def release_lock(self, warehouse_id: int, lock_id: uuid.UUID, user_id: int):
        lock = self.repo.get(warehouse_id)
        if not lock:
            raise ValueError("Lock not found")
        if lock.lock_id != lock_id or lock.locked_by != user_id:
            raise ValueError("Invalid lock")
        self.repo.delete(warehouse_id)
        return lock

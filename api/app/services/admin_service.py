from app.core.security import hash_password
from app.models.user import User

class AdminService:
    def __init__(self, users, audit):
        self.users = users
        self.audit = audit

    def create_user(self, payload, admin):
        user = User(
            login=payload.login,
            password_hash=hash_password(payload.password),
            role=payload.role,
            is_active=True,
            must_change_pwd=True,
        )
        self.users.create(user)
        self.audit.log("ADMIN_CREATE_USER", admin.id, entity="user")
        return user

    def update_user(self, user, payload, admin):
        if payload.role is not None:
            user.role = payload.role
        if payload.is_active is not None:
            user.is_active = payload.is_active
        if payload.password is not None:
            user.password_hash = hash_password(payload.password)
            user.must_change_pwd = True
        self.audit.log("ADMIN_UPDATE_USER", admin.id, entity="user", entity_id=user.id)
        return user

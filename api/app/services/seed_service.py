import os

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User, UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.user_repo import UserRepository
from app.services.audit_service import AuditService


def seed_default_users(db: Session) -> None:
    users_repo = UserRepository(db)
    if users_repo.count() > 0:
        return

    default_password = os.getenv("DEFAULT_USER_PASSWORD", "ChangeMe123!")
    seeds = [
        ("admin", UserRole.ADMIN),
        ("kierownik", UserRole.KIEROWNIK),
        ("magazynier", UserRole.MAGAZYNIER),
    ]

    for login, role in seeds:
        users_repo.create(
            User(
                login=login,
                password_hash=hash_password(default_password),
                role=role,
                is_active=True,
                must_change_pwd=True,
            )
        )

    AuditService(AuditRepository(db)).log(
        "SEED_USERS",
        details={"count": len(seeds)},
    )
    db.commit()

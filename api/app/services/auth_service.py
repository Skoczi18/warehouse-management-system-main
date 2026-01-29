from app.core.security import verify_password
from app.core.jwt import create_token

class AuthService:
    def __init__(self, users, audit):
        self.users = users
        self.audit = audit

    def login(self, username, password):
        user = self.users.by_login(username)
        if not user or not user.is_active:
            self.audit.log(
                "LOGIN_FAIL",
                details={"reason": "user_not_found_or_inactive", "login": username},
            )
            raise ValueError("Invalid credentials")

        if not verify_password(password, user.password_hash):
            self.audit.log(
                "LOGIN_FAIL",
                user.id,
                details={"reason": "invalid_password", "login": username},
            )
            raise ValueError("Invalid credentials")

        token = create_token({"sub": str(user.id), "role": user.role.value})
        self.audit.log("LOGIN_OK", user.id)
        return token, user

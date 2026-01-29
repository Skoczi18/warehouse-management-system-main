from passlib.context import CryptContext

# Use a backend-free scheme to avoid bcrypt build issues on some environments.
pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"])

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(password: str, hash: str) -> bool:
    return pwd_ctx.verify(password, hash)

from app.utils.security import verify_token
from app.utils.security import oauth2_scheme

from jose import JWTError
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate

from app.utils.security import hash_password

from app.schemas.user import UserLogin
from app.utils.security import verify_password
from app.utils.security import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }
@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
@router.get("/me")
def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    email = verify_token(token)

    if not email:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return {
        "email": email
    }
@router.get("/me")
def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    email = verify_token(token)

    if not email:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return {
        "email": email
    }
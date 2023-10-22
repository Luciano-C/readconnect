from fastapi import Security, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from utils.get_db import get_db
import jwt
from dotenv import load_dotenv
import os
from database_models.database_models import User
from jwt import PyJWTError
from pydantic import BaseModel


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')
ALGORITHM = os.environ.get('ALGORITHM')
DATABASE_NAME = os.environ.get('DATABASE_NAME') 


class TokenData(BaseModel):
    email: str = None

credentials_exception = HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

def get_current_user(db: Session = Depends(get_db), token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except PyJWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

    

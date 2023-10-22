from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from models.authentication_models import *


from sqlalchemy.orm import Session
from database_models.database_models import User, Base  
from utils.get_db import get_db

import os


load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')
ALGORITHM = os.environ.get('ALGORITHM')
DATABASE_NAME = os.environ.get('DATABASE_NAME') 

router = APIRouter()


    
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



@router.post('/login', response_model=Token, tags=["Authentication"])
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user and return a token.
    """
    
    # Retrieve user from the database
    user = db.query(User).filter(User.email == login_request.email).first()
    
    if not user or not user.check_password(login_request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate access token
    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {"access_token": access_token, "token_type": "bearer"}







@router.post("/register", tags=["Authentication"])
async def register(new_user: NewUser, db: Session = Depends(get_db)):
    """
    Register a new user.
    """

    # Check if the user already exists
    db_user = db.query(User).filter(User.email == new_user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user instance
    user = User(username=new_user.username, email=new_user.email)
    user.set_password(new_user.password)
    
    # Add to database
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"id": user._id, "username": user.username, "email": user.email}




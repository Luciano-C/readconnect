from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session
from config.database_connection import SessionLocal
from database_models.database_models import User
from utils.get_db import get_db
from models.users import *
from utils.get_current_user import get_current_user


router = APIRouter()

@router.patch("/user/update-username", tags=["Users"])
async def update_username(request: UpdateUsernameRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update the username of the currently logged-in user."""

    # Check if the new username already exists
    user_with_new_username = db.query(User).filter(User.username == request.new_username).first()
    if user_with_new_username:
        raise HTTPException(status_code=400, detail="Username already in use")

    # Update the username
    current_user.username = request.new_username
    db.commit()

    return {"message": "Username updated successfully"}
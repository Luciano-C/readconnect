from pydantic import BaseModel
from datetime import datetime
from typing import List


class UpdateUsernameRequest(BaseModel):
    new_username: str

class UserResponse(BaseModel):
    username: str
    email: str
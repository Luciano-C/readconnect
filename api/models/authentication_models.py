from pydantic import BaseModel
from typing import Optional
from enum import Enum

class NewUser(BaseModel):
    username: str
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: str
    password: str

class LoginData(BaseModel):
    pass
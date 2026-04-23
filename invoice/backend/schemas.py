from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str,Enum):
    admin = "admin"
    staff = "staff"
    accountant = "accountant"


class Registration(BaseModel):
    name: str
    phone: str
    password: str 
    role: UserRole
    bussiness_id: str

class Login(BaseModel):
    phone: str
    password: str 

class CreateCategories(BaseModel):
    name : str
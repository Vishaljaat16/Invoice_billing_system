from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import List

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

#  ----------- To Display all the items inside the items table ----------
class ItemResponse(BaseModel):
    id: int 
    name: str 
    
    class Config:
        from_attributes = True 
    
class CategoryResponse(BaseModel):
    id: int
    name: str
    items: List[ItemResponse] = []

    class Config:
        from_attributes = True


# --------------- Adding Items to the card -----------

class AddItem(BaseModel):

    name: str 
    price: int
    unit: str
    stock: int
    gst_rate: int


#----------------- Invoice Item Create --------------- 

class InvoiceItemCreate(BaseModel):
    item_id: int  
    quantity: int 

class InvoiceCreate(BaseModel):
    customer_name: str 
    customer_phone: str 
    items: List[InvoiceItemCreate]
    payment_mode: str
    discount: float = 0

class CustomerOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class InvoiceOut(BaseModel):
    id: int
    total_amount: float
    customer: CustomerOut

    class Config:
        from_attributes = True
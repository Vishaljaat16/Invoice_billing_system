from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as sqlEnum, Float, Boolean
from datetime import datetime
from database import Base
from schemas.schemas import UserRole
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, unique=True, index=True)
    name = Column(String(50), unique=True)
    phone = Column(String(12), primary_key=True)
    password = Column(String(200))
    role = Column(sqlEnum(UserRole), default=UserRole.staff)
    bussiness_id =  Column(String(50), unique=True)

    categories = relationship("Categories", back_populates="users")
    items = relationship("Items", back_populates="users")

class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'

    id = Column(Integer, primary_key=True, index=True)
    user_phone = Column(String(200), ForeignKey("users.phone"), unique=True)
    ref_token = Column(String(200), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow )


class Categories(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    bussiness_id = Column(String(50), ForeignKey('users.bussiness_id'))
    name = Column(String(100))

    users = relationship("User", back_populates="categories")


class Items(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    bussiness_id = Column(String(100), ForeignKey("users.bussiness_id"))
    name = Column(String(100), unique=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    price = Column(Float)
    unit = Column(String(50))
    stock = Column(Integer)
    gst_rate = Column(Integer)

    users = relationship("User", back_populates='items')



class Invoice(Base):
    __tablename__ = "invoice"

    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String(100))
    bussiness_id = Column(String(100))
    customer_id = Column(Integer, ForeignKey("customer.id"))
    total_amount = Column(Float)
    tax_amount = Column(Float)
    discount = Column(Float)
    payment_mode = Column(String(100))
    status = Column(String(100))
    pdf_url = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow())

    customer = relationship("Customer", back_populates="invoices")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True)
    invoice_id = Column(Integer, ForeignKey("invoice.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    quantity = Column(Integer)
    price = Column(Integer)
    total = Column(Integer)


class Customer(Base):
    __tablename__ = "customer"

    id = Column(Integer, primary_key=True, index=True)
    bussiness_id = Column(String(100), )
    name = Column(String(100))
    phone = Column(String(100))
    balance = Column(Float)

    invoices = relationship("Invoice", back_populates="customer")

    class Config:
        from_attributes = True
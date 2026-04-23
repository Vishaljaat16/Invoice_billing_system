from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as sqlEnum
from datetime import datetime
from database import Base
from schemas import UserRole
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, unique=True, index=True)
    name = Column(String(50), unique=True)
    phone = Column(String(12), primary_key=True)
    password = Column(String(200))
    role = Column(sqlEnum(UserRole), default=UserRole.staff)
    bussiness_id =  Column(String(50), unique=True)

    categories = relationship("Categories", back_populates="users", uselist=False)

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

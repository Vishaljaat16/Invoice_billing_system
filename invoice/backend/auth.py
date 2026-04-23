from passlib.context import CryptContext 
from fastapi import HTTPException, Depends, status
from dotenv import load_dotenv
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
import bcrypt
import os
import models
from database import get_db

load_dotenv(dotenv_path='config.env')

SECRET_KEY = os.environ.get('SECRET_KEY')
ALGORITHM = os.environ.get('ALGORITHM')

pwd_context = CryptContext(schemes='bcrypt')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data:dict):
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token

def create_refresh_token(data:dict):
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token

def authenticate_user(phone: str, password:str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user 

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # try:
    #     payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    #     return payload
    # except JWTError:
    #     raise HTTPException(status_code=401, detail="Invalid token")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_phone:str = payload.get("phone")
        
        if user_phone is None: 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid Token")
    
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token Expired")

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid Token")

    user = db.query(models.User).filter(models.User.phone == user_phone).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User Not Found")
    return user 


def require_roles(allowed_roles: list):
    def role_checker(user=Depends(get_current_user)):

        if user.role not in allowed_roles:
            raise HTTPException(status_code=401, detail="Access denied")
        return user 
    return role_checker
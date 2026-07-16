import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status 
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    get_current_user,
    require_roles,
    authenticate_user,
    checkUser,
    SECRET_KEY,
    ALGORITHM,   
)
from jose import jwt, JWTError, ExpiredSignatureError
import database
from schemas import schemas
from models import models
from database import get_db

router = APIRouter()


# * Cookie Function
def set_auth_cookie(response: Response, r_token: str):

    response.set_cookie(
        key="refresh_token",
        value=r_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=60 * 60 * 24 * 7,
    )


@router.post("/register")
def registration(user: schemas.Registration, db: Session = Depends(get_db)):

    # user_exist = db.query(models.User).filter(models.User.phone == user.phone).first()
    user_exist = authenticate_user(user.phone, user.password, db)
    existing_user = checkUser(user, db)

    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail= "User is already Registered")

    # hashed_password = hash_password(user.password)

    new_user = models.User(
        name=user.name,
        phone=user.phone,
        password=hash_password(user.password),
        role=user.role,
        bussiness_id=user.bussiness_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # return {"message": "User Registered Successfully"}
    raise HTTPException(
        status_code=status.HTTP_201_CREATED,
        detail="User Registered Successfully"
    )


# * ----------- importing env file for login purpose -------------

load_dotenv(dotenv_path='config.env')
ACCESS_TOKEN_TIME_PERIOD = os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES")
REFRENCE_TOKEN_TIME_PERIOD = os.environ.get("REFRENCE_TOKEN_EXPIRE_DAY")


@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user_exist = authenticate_user(form_data.username, form_data.password, db)

    if not user_exist:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # -------------- Payload access token ------------
    a_token = {
        "sub": str(user_exist.id),
        "phone": user_exist.phone,
        "role": user_exist.role,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=15),
        "iat": datetime.utcnow()
    }

    # -------------- Payload refresh token ------------
    r_token = {
        "sub": str(user_exist.id),
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }

    # -------------- Token Generation ---------------
    access_token = create_access_token(a_token)
    refresh_token = create_refresh_token(r_token)

    # ------------- Refresh Token DB -----------------
    r_token = models.RefreshToken(
        user_phone=user_exist.phone,
        ref_token=hash_password(refresh_token),
    )

    # ------------- Check DB for RefreshToken -------------
    refresh_exist = db.query(models.RefreshToken).filter(
        models.RefreshToken.user_phone == r_token.user_phone).first()

    if refresh_exist:
        db.delete(refresh_exist)
        db.commit()

    db.add(r_token)
    db.commit()
    db.refresh(r_token)

    set_auth_cookie(response, refresh_token)

    return {
        "access_token": access_token,
        "username": user_exist.name,
        "phone": user_exist.phone
    }


# ------------- Logout ------------------

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):

    ref_token = request.cookies.get("refresh_token")
    hashed = hash_password(ref_token)

    if not ref_token:
        raise HTTPException(
            status_code=400, detail="NO refresh token provided")

    token_entry = db.query(models.RefreshToken).filter(
        models.RefreshToken.ref_token == hashed).first()

    if token_entry:
        db.delete(token_entry)
        db.commit()

    # response.delete_cookie("access_token")
    response.delete_cookie(key="refresh_token",
                           httponly=True, secure=False, samesite="lax")

    # return {"message": "User Logout successfully"}
    raise HTTPException(
        status_code=status.HTTP_200_OK,
        detail="User Logout Successfully"
    )



# --------------------- Refresh Token------------------4

@router.post("/refreshtoken")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):

    ref_token = request.cookies.get("refresh_token")

    if not ref_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    try:
        payload = jwt.decode(ref_token, SECRET_KEY, algorithms=ALGORITHM)

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user_phone = payload.get("phone")
        db_tokens = db.query(models.RefreshToken).filter(models.RefreshToken.phone == user_phone).all()

        valid_token = None

        for t in db_tokens:
            if verify_password(token, t.token):
                valid_token = t 
                break 
        
        if not valid_token:
            raise HTTPException(status_code=401, detail="Token Not Found")

        new_payload = {
            "phone": user_phone,
            "exp": datetime.utcnow() + timedelta(minutes=15)
        }

        new_access_token = jwt.decode(
            new_payload, SECRET_KEY,             algorithms=ALGORITHM)

        return {
            "message": "Token refreshed",
            "access_token": new_access_token
        }
    
    except ExpiredSignatureError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED, detail = "TOKEN_EXPIRED")

    except JWTError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED, detail= "Invalid Token")

    except HTTPException as e:
        return e 
    
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = "Something went wrong"
        )


from services.invoice_service import create_invoice_service
from services.pdf import generate_invoice_pdf
@router.post("/invoice",  response_model=schemas.InvoiceOut)
def create_invoice(data: schemas.InvoiceCreate, db: Session = Depends(get_db), user=Depends(require_roles(["admin", "staff"]))):

    invoice = create_invoice_service(db, data, user.bussiness_id)
    return invoice
    # return {
    #     "message": f"Invoice created by {user.role}",
    #     "invoice_id" : models.Invoice.id,
    #     # "invoice_pdf": generate_invoice_pdf(models.Invoice.id)
    # }


@router.get("/reports")
def view_reports(user=Depends(require_roles(["admin", "accountant"]))):
    return {"message": f"Reports viewd by {user.role}"}


@router.get('/admin')
def admin_panel(user=Depends(require_roles(["admin"]))):
    return {"message": "Welcome Admin"}

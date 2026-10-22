from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import database
from schemas import schemas
from models import models
from database import get_db
from services.invoice_service import create_invoice_service
from services.pdf import generate_invoice_pdf
from auth import require_roles
router = APIRouter()

@router.post("/invoice",  response_model=schemas.InvoiceOut)
def create_invoice(data: schemas.InvoiceCreate, db: Session = Depends(get_db), user=Depends(require_roles(["admin", "staff"]))):

    invoice = create_invoice_service(db, data, user.bussiness_id)
    return invoice
    # return {
    #     "message": f"Invoice created by {user.role}",
    #     "invoice_id" : models.Invoice.id,
    #     # "invoice_pdf": generate_invoice_pdf(models.Invoice.id)
    # }

# @router.post("/pdf_generate")
# def generate_pdf()


@router.get("/reports")
def view_reports(user=Depends(require_roles(["admin", "accountant"]))):
    return {"message": f"Reports viewd by {user.role}"}


@router.get('/admin')
def admin_panel(user=Depends(require_roles(["admin"]))):
    return {"message": "Welcome Admin"}

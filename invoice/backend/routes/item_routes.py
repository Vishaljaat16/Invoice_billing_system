from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from models import models
from schemas import schemas 
from database import get_db, Session
from auth import require_roles
router = APIRouter()



# -------------------- ADDING ITEMS --------------------
@router.post("/additems")
def add_items(items: schemas.AddItem, db: Session = Depends(get_db), cate_user = Depends(require_roles(["staff"]))):

    existing = db.query(models.Items).filter(
        models.Items.name == items.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item already exists in this category"
        )

    cat = db.query(models.Categories).first()

    new_items = models.Items(
        bussiness_id = cate_user.bussiness_id,
        name = items.name,
        category_id = cat.id ,
        price = items.price,
        unit = items.unit,
        stock = items.stock,
        gst_rate = items.gst_rate
    )

    try:
        db.add(new_items)
        db.commit()
        db.refresh(new_items)
    except InterruptedError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate item"
        )

    return {"message" : "Items Added Successfully"}    

@router.get("/getitems")
def get_items(db: Session = Depends(get_db), user = Depends(require_roles(["staff"]))):

    items = db.query(models.Items).all()
    return items

@router.patch("/updateitems/{item_id}")
def update_items(item_id:int, item: schemas.AddItem, db: Session = Depends(get_db), user = Depends(require_roles(["staff"]))):

    check_item = db.query(models.Items).filter(models.Items.id == item_id).first()

    if not check_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item Not Found"
        )
    
    check_item.name = item.name 
    check_item.price = item.price 
    check_item.unit = item.unit 
    check_item.stock = item.stock
    check_item.gst_rate = item.gst_rate

    db.commit()
    db.refresh(check_item)

    return {"message": "Item Successfully Updated"}

@router.delete("/deleteitems/{item_id}")
def delete_item(item_id:int, db:Session = Depends(get_db), user = Depends(require_roles(["staff"]))):

    check_item = db.query(models.Items).filter(models.Items.id == item_id).first()

    if not check_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item Not Found"
        )

    db.delete(check_item)
    db.commit()

    return {"message": "Item Successfully Deleted"}
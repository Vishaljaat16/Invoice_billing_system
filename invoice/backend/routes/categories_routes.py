from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from models import models
from schemas import schemas 
from database import get_db, Session
from auth import require_roles
router = APIRouter()

# ---------- CREATE CATEGORY ---------------
@router.post("/addcategory")
def create_category(Category: schemas.CreateCategories, db: Session = Depends(get_db), cateuser=Depends(require_roles(["admin"]))):

    new_category = models.Categories(
        bussiness_id= cateuser.bussiness_id,
        name=Category.name,
    )
    check_category = db.query(models.Categories).filter(models.Categories.name == Category.name).all()
    
    if check_category:
        raise HTTPException(status_code=409, detail="Category already registered")
    else:
        db.add(new_category)
        db.commit()
        db.refresh(new_category)

    return {
        "message": "Category Created",
        "data": {
            "category_id": new_category.id,
            "category_name": new_category.name
        }
    }

#  ----------------- GET CATEGORY -------------------
@router.get("/getcategory", response_model=list[schemas.CategoryResponse])
def get_category(db: Session = Depends(get_db), cate_user = Depends(require_roles(["admin","staff"]))):
    items = db.query(models.Categories).all()
    return items 

@router.patch("/updatecategory/{id}")
def update_category(category_id: int, category: schemas.CreateCategories, db:session = Depends(get_db), cate_user = Depends(require_roles(["admin"])),  ):

    check_category = db.query(models.Categories).filter(models.Categories.id == category_id).first()

    if not check_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = "Data Not Found"
        )
    
    check_category.name = category.name 
    print(category.name)
    db.commit()
    db.refresh(check_category)

    return {"message":"User Updated Successfully"}

@router.delete("/deletecategory/{category_id}")
def delete_category(category_id:int, db: Session = Depends(get_db), cate_user = Depends(require_roles(["admin"]))):
    check_category = db.query(models.Categories).filter(models.Categories.id == category_id).first()

    # items = db.query(models.Items).filter(models.Items.category_id == category_id).all()

    if not check_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data Not Found"
        )

    # for item in items:
    #     db.delete(item)
    db.query(models.Items).filter(models.Items.category_id == category_id).delete(synchronize_session=False)
    
    db.delete(check_category)
    db.commit()
    # return check_category 
    return {"message": "Data Deleted successfully"}
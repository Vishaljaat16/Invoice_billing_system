from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from routes import categories_routes, auth_routes, item_routes

app = FastAPI()

origins = [
    "http://localhost:5173",  # React (Vite)
    "http://127.0.0.1:5173",  # React (CRA)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allowed frontend URLs
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, etc.
    allow_headers=["*"],            # Authorization, etc.
)


app.include_router(router=auth_routes.router)
app.include_router(router=categories_routes.router)
app.include_router(router=item_routes.router)

from database import engine 
from models.models import Base

Base.metadata.create_all(bind=engine)


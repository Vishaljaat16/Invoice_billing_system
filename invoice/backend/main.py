from fastapi import FastAPI 
from auth_routes import router 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # React (Vite)
    "http://127.0.0.1:5173",  # React (CRA)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allowed frontend URLs
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, etc.
    allow_headers=["*"],            # Authorization, etc.
)


app.include_router(router=router)

from database import engine 
from models import Base

Base.metadata.create_all(bind=engine)


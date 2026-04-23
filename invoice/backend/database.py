from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base ,Session

DATABASE_URL = "mysql+pymysql://root:Vishu%401609@127.0.0.1:3306/learnfastapi"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine, 
    autocommit=False, 
    autoflush=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
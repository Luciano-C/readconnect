from sqlalchemy import create_engine
from config.database_connection import Base, DATABASE_URL
from database_models.database_models import *

engine = create_engine(DATABASE_URL)

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
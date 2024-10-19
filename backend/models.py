from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

Base = declarative_base()

def current_time_utc():
    return datetime.datetime.utcnow()

class Site(Base):
    __tablename__ = 'sites'
    id = Column(Integer, primary_key=True)
    url = Column(String, unique=True, nullable=False)
    confidence = Column(String, unique=False, nullable=False)
    updated_at = Column(DateTime, default=current_time_utc, onupdate=current_time_utc)

class Coin(Base):
    __tablename__ = 'coins'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    confidence = Column(String, unique=False, nullable=False)
    updated_at = Column(DateTime, default=current_time_utc, onupdate=current_time_utc)

engine = create_engine('sqlite:///database.db')

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
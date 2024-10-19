from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models
import datetime

app = FastAPI()

# Dependency to get the database session
def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the TonDefender API"}

# Get all sites
@app.get("/sites")
def get_sites(db: Session = Depends(get_db)):
    sites = db.query(models.Site).all()
    return sites

# Get all coins
@app.get("/coins")
def get_coins(db: Session = Depends(get_db)):
    coins = db.query(models.Coin).all()
    return coins

# Get site changes after a specific date
@app.get("/sites/changes")
def get_site_changes(after: datetime.datetime, db: Session = Depends(get_db)):
    changes = db.query(models.Site).filter(models.Site.updated_at > after).all()
    return changes

# Get coin changes after a specific date
@app.get("/coins/changes")
def get_coin_changes(after: datetime.datetime, db: Session = Depends(get_db)):
    changes = db.query(models.Coin).filter(models.Coin.updated_at > after).all()
    return changes
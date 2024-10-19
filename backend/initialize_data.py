# initialize_data.py

from models import SessionLocal, Site, Coin
import datetime

def add_test_data():
    db = SessionLocal()

    # Add a test site
    new_site = Site(url='https://example.com', confidence="good", updated_at=datetime.datetime.utcnow())
    db.add(new_site)

    # Add a test coin
    new_coin = Coin(name='Bitcoin', confidence="good", updated_at=datetime.datetime.utcnow())
    db.add(new_coin)

    db.commit()
    db.close()
    print("Test data added successfully.")

if __name__ == '__main__':
    add_test_data()
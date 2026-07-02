import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, DATABASE_URL
import models

def seed_db():
    print(f"Connecting to database: {DATABASE_URL}")
    engine = create_engine(DATABASE_URL)
    
    # Create tables if they do not exist
    print("Creating tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if table already has records
        count = db.query(models.Student).count()
        if count > 0:
            print(f"Database already has {count} students. Skipping seeding to prevent duplicate roll_no values.")
            return

        dummy_students = [
            models.Student(name="Ayaan Khan", roll_no="S101", phone_number="9876543210"),
            models.Student(name="Maseera Arshad", roll_no="S102", phone_number="8765432109"),
            models.Student(name="Zainab Fatima", roll_no="S103", phone_number="7654321098"),
            models.Student(name="Hamza Siddiqui", roll_no="S104", phone_number="6543210987"),
            models.Student(name="Sarah Ahmed", roll_no="S105", phone_number="5432109876")
        ]
        
        db.add_all(dummy_students)
        db.commit()
        print("[+] Successfully seeded 5 dummy student records into PostgreSQL!")
    except Exception as e:
        print(f"[-] Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

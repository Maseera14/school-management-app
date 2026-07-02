from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from redis_client import get_cached_students, set_cached_students, invalidate_student_cache

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Isko simple karne ke liye abhi sab allow kar dete hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the School Management API"}

@app.get("/api/students", response_model=List[schemas.Student])
def get_students(db: Session = Depends(get_db)):
    # 1. Try to fetch from Redis Cache
    cached_data = get_cached_students()
    if cached_data is not None:
        return cached_data
        
    # 2. Cache miss: Query Postgres
    students = db.query(models.Student).all()
    
    # 3. Store in Redis Cache
    set_cached_students(students)
    
    return students

@app.post("/api/students", response_model=schemas.Student)
def add_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Student).filter(models.Student.roll_no == student.roll_no).first()
    if existing:
        raise HTTPException(status_code=400, detail="Roll number already exists!")
    
    new_student = models.Student(
        name=student.name,
        roll_no=student.roll_no,
        phone_number=student.phone_number
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    # Invalidate cache since database was modified
    invalidate_student_cache()
    
    return new_student

@app.delete("/api/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found!")
    
    db.delete(student)
    db.commit()
    
    # Invalidate cache since database was modified
    invalidate_student_cache()
    
    return {"message": f"Student with ID {student_id} deleted successfully!"}
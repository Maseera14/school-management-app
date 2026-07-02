from pydantic import BaseModel

class StudentBase(BaseModel):
    name: str
    roll_no: str
    phone_number: str

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int

    class Config:
        from_attributes = True
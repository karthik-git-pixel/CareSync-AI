from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base

class PatientDB(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    conditions = Column(String) # Stores conditions like "Hypertension, Diabetes"

class VitalSignDB(Base):
    __tablename__ = "vitals"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id")) # Links vitals to a patient
    heart_rate = Column(Float)
    spo2 = Column(Float)
    blood_pressure = Column(String)
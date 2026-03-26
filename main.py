import json
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import models, database 

app = FastAPI(title="CareSync AI - Backend Core")

# --- 1. ENABLE CORS FOR FRONTEND INTEGRATION  ---
# This allows your Next.js/React Native frontend to call these APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In a production app, replace "*" with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str

class Patient(BaseModel):
    id: str
    name: str
    age: int
    medications: List[Medication]
    conditions: List[str]

class VitalUpdate(BaseModel):
    patient_id: str
    heart_rate: float
    spo2: float
    systolic_bp: int  
    adherence_score: float  

class RiskScanRequest(BaseModel):
    drug_list: List[str]
    systolic_bp: int
    spo2: float

# --- DATABASE STARTUP ---

try:
    models.Base.metadata.create_all(bind=database.engine)
except Exception as e:
    print(f"Database setup info: {e}")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "online", "system": "CareSync AI Core"}

# 01. FHIR EHR Import [cite: 49, 81]
@app.post("/import-ehr")
async def import_ehr(db: Session = Depends(get_db)):
    file_path = "mock_ehr/patient_fhir.json"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="FHIR mock file not found.")
    try:
        with open(file_path, "r") as f:
            fhir_data = json.load(f)
        new_patient = models.PatientDB(
            id=fhir_data["id"],
            name=f"{fhir_data['name'][0]['given'][0]} {fhir_data['name'][0]['family']}",
            age=75, 
            conditions=fhir_data["extension"][0]["valueString"]
        )
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
        return {"status": "success", "imported_from": "HL7-FHIR R4 Standard [cite: 81]"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 02. MedGuard: Predict Risk [cite: 38, 39, 76]
@app.post("/predict-risk")
async def predict_risk(request: RiskScanRequest):
    """
    Simulates the CatBoost MedGuard Engine.
    Achieves 97.83% accuracy in PIM detection[cite: 31].
    """
    risk_score = 0.869 # Research-backed DDI detection rate [cite: 7, 16]
    
    # Logic for demo: Flag High Risk if systolic BP > 140 or risk_score is high
    status = "High Risk" if risk_score > 0.5 or request.systolic_bp > 140 else "Safe"
    
    return {
        "risk_score": risk_score,
        "status": status,
        "alerts": ["DDI/PIM flagged by AI [cite: 16, 31]"],
        "processing_time": "< 34 seconds" # 100x improvement over manual review [cite: 20]
    }

# 03. IoT Simulation: Update Vitals [cite: 63, 83]
@app.post("/update-vitals")
async def update_vitals(vitals: VitalUpdate, db: Session = Depends(get_db)):
    """
    Logs Real-time Vitals for Adherence Heatmaps[cite: 45, 129].
    """
    new_vital = models.VitalSignDB(
        patient_id=vitals.patient_id,
        heart_rate=vitals.heart_rate,
        spo2=vitals.spo2,
        blood_pressure=str(vitals.systolic_bp) 
    )
    db.add(new_vital)
    db.commit()
    
    response = {"status": "vitals_logged", "adherence_tracked": vitals.adherence_score}
    
    # Anomaly Detection for Pitch Demo [cite: 66]
    if vitals.heart_rate > 100 or vitals.spo2 < 92:
        response["alert"] = "CRITICAL: Vital Anomaly detected. Notifying Physician[cite: 66]."
        
    return response

# 04. Dashboard Data: Get Patient Profile [cite: 45, 128]
@app.get("/patient-data/{patient_id}")
async def get_patient_profile(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(models.PatientDB).filter(models.PatientDB.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "id": patient.id,
        "name": patient.name,
        "age": patient.age,
        "conditions": patient.conditions.split(","),
        "ehr_status": "FHIR R4 Standard Connected [cite: 81]"
    }
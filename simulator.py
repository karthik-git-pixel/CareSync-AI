import requests
import time
import random

# The URL of your local FastAPI server
URL = "http://127.0.0.1:8000/update-vitals"

def simulate_vitals():
    print("CareSync AI Virtual Wearable Started...")
    while True:
        # Generate realistic geriatric vitals [cite: 63]
        payload = {
            "patient_id": "FHIR-99",
            "heart_rate": round(random.uniform(70, 110), 1), # High end triggers your alert
            "spo2": round(random.uniform(94, 99), 1),
            "systolic_bp": random.randint(110, 145),
            "adherence_score": 0.95
        }
        
        try:
            response = requests.post(URL, json=payload)
            print(f"Sent: HR {payload['heart_rate']} - Server Response: {response.json()}")
        except Exception as e:
            print(f"Connection failed: {e}")
            
        time.sleep(5) # Send data every 5 seconds for a "Live" feel

if __name__ == "__main__":
    simulate_vitals()
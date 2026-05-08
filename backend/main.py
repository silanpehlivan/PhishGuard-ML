import os
import json
import csv
import joblib
import uvicorn
from datetime import datetime
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load model and metrics
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pkl")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")
LOG_PATH = os.path.join(BASE_DIR, "prediction_logs.csv")

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    print(f"Model yüklenemedi: {e}")

try:
    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)
except:
    metrics = {}

app = FastAPI(
    title="Phishing Detection API",
    description="API for predicting whether a URL is phishing or not based on its features."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Features(BaseModel):
    having_IP_Address: int
    URL_Length: int
    Shortining_Service: int
    having_At_Symbol: int
    double_slash_redirecting: int
    Prefix_Suffix: int
    having_Sub_Domain: int
    SSLfinal_State: int
    Domain_registeration_length: int
    Favicon: int
    port: int
    HTTPS_token: int
    Request_URL: int
    URL_of_Anchor: int
    Links_in_tags: int
    SFH: int
    Submitting_to_email: int
    Abnormal_URL: int
    Redirect: int
    on_mouseover: int
    RightClick: int
    popUpWidnow: int
    Iframe: int
    age_of_domain: int
    DNSRecord: int
    web_traffic: int
    Page_Rank: int
    Google_Index: int
    Links_pointing_to_page: int
    Statistical_report: int


class AnalysisLog(BaseModel):
    tested_url: str
    final_prediction: int
    final_status: str
    confidence: Optional[float] = None
    model_prediction: int
    model_status: str
    heuristic_override: bool = False
    probability_legitimate: Optional[float] = None
    probability_phishing: Optional[float] = None
    features: Dict[str, int]


def save_analysis_log(log_data: AnalysisLog):
    feature_columns = list(log_data.features.keys())

    base_columns = [
        "timestamp",
        "tested_url",
        "final_prediction",
        "final_status",
        "confidence",
        "model_prediction",
        "model_status",
        "heuristic_override",
        "probability_legitimate",
        "probability_phishing"
    ]

    fieldnames = base_columns + feature_columns
    file_exists = os.path.exists(LOG_PATH)

    row = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "tested_url": log_data.tested_url,
        "final_prediction": log_data.final_prediction,
        "final_status": log_data.final_status,
        "confidence": log_data.confidence,
        "model_prediction": log_data.model_prediction,
        "model_status": log_data.model_status,
        "heuristic_override": log_data.heuristic_override,
        "probability_legitimate": log_data.probability_legitimate,
        "probability_phishing": log_data.probability_phishing
    }

    row.update(log_data.features)

    with open(LOG_PATH, "a", newline="", encoding="utf-8-sig") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow(row)


@app.get("/")
def root():
    return {"message": "Phishing Detection API is running!"}


@app.get("/metrics")
def get_metrics():
    return metrics


@app.post("/log-analysis")
def log_analysis(log_data: AnalysisLog):
    try:
        save_analysis_log(log_data)
        return {"message": "Analiz sonucu CSV dosyasına kaydedildi."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Log kaydedilemedi: {str(e)}")


@app.post("/predict")
def predict(features: Features):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    # Convert features to a 2D array (1 sample, n features)
    feature_values = [[getattr(features, field) for field in features.model_fields.keys()]]

    try:
        prediction = model.predict(feature_values)[0]

        # prediction is 0 (legitimate) or 1 (phishing)
        prob = model.predict_proba(feature_values)[0] if hasattr(model, "predict_proba") else None

        confidence = None
        if prob is not None:
            pred_idx = int(prediction)
            confidence = float(prob[pred_idx])

        return {
            "prediction": int(prediction),
            "status": "Phishing" if prediction == 1 else "Legitimate",
            "probability": prob.tolist() if prob is not None else None,
            "confidence": confidence
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# This file handles the API endpoints for making predictions.
# It receives requests fron the frontend and returns responses.

from fastapi import APIRouter, HTTPException
import pandas as pd
import json
from pathlib import Path
from app.schemas.house import HouseFeatures, PredictionResponse
from app.models.ml_model import model

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_price(features: HouseFeatures):
    # Endpoint that takes property features and return price prediction
    # Input: Property features (rooms, distance, etc)
    # Output: Predicted 
    try:
         # Convert the input data into the format our model expects
        input_data = pd.DataFrame([[
            features.rooms,
            features.distance,
            features.bedroom2,
            features.bathroom,
            features.car,
            features.postcode,
            features.lattitude,
            features.longtitude
        ]], columns=['Rooms', 'Distance', 'Bedroom2', 'Bathroom', 'Car', 'Postcode', 'Lattitude', 'Longtitude'])
        
        # Use our trained model to make a prediction
        prediction = model.predict(input_data)[0]
        
        return {"prediction": float(prediction)}
    except Exception as e:
        # If anything goes wrong, return an error
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-metrics")
async def get_model_metrics():
    # Endpoint that returns model performance metrics
    # Output: Model accuracy statistics and information
    try:
        metrics_path = Path("models/model_metrics.json")
        if not metrics_path.exists():
            return {"message": "Model metrics not available"}
        
        with open(metrics_path) as f:
            metrics = json.load(f)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
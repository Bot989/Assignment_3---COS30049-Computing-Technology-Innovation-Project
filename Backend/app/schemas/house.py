
# This file defines the data structures (schemas) used for input and output in our API.
# It specifies what data is required when making predictions and what data is returned.

from pydantic import BaseModel, Field
from typing import Optional

class HouseFeatures(BaseModel):
     # Defines the required features needed to make a house price prediction.
     # Each field represents a characteristic of the house.

     # Define each feature with its type and description
    rooms: float = Field(..., description="Number of rooms in the house")
    distance: float = Field(..., description="Distance from CBD in kilometers")
    bedroom2: float = Field(..., description="Number of bedrooms")
    bathroom: float = Field(..., description="Number of bathrooms")
    car: float = Field(..., description="Number of car spaces")
    postcode: float = Field(..., description="Postcode of the house location")
    lattitude: float = Field(..., description="Latitude coordinates of the house")
    longtitude: float = Field(..., description="Longitude coordinates of the house")

    class Config:
        # Provides an example of valid input data.
        # This helps users understand what data to send.
        json_schema_extra = {
            "example": {
                "rooms": 3.0,
                "distance": 2.5,
                "bedroom2": 3.0,
                "bathroom": 2.0,
                "car": 1.0,
                "postcode": 3067.0,
                "lattitude": -37.8093,
                "longtitude": 144.9944
            }
        }

class PredictionResponse(BaseModel):

    # Defines the structure of the prediction response.
    # This is what the API returns after making a prediction.
    prediction: float = Field(..., description="Predicted house price")
    
    class Config:
        # Provides an example of what the prediction response looks like.
        # Shows users what to expect from the API.
        json_schema_extra = {
            "example": {
                "prediction": 1465000.0
            }
        }

# Defines the structure for model performance metrics.
# Used to track how well our model is performing.
class ModelMetrics(BaseModel):
    r2_score: float
    features_used: list[str]
    training_samples: int
    test_samples: int
    
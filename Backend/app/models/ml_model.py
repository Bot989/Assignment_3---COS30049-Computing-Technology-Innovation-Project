
# This file contains our machine learning model code.
# It handles loading the data, training the model, and saving the results.

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import matplotlib.pyplot as plt
from pathlib import Path

# Define paths for saving and loading files
MODEL_PATH = Path("models/melbourne_housing_model.joblib")
DATA_PATH = Path("data/Updated_Melbourne_housing_FULL.csv")
METRICS_PATH = Path("models/model_metrics.json")

# Train a new model and evaluate its performance
# Returns: Trained model ready for making predictions

def train_and_evaluate_model():
    # Load the Updated Melbourne Housing Dataset
    df = pd.read_csv(DATA_PATH)

    # Define features columns that will be used to predict house prices
    features = ['Rooms', 'Distance', 'Bedroom2', 'Bathroom', 'Car', 'Postcode', 'Lattitude', 'Longtitude']
    X = df[features]  # Independent Variables
    y = df['Price']   # Dependent Variables

    # Split the data into training and testing sets
    # 70% of data will be used for training and 30% for testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Initialize the Random Forest Regressor model with 100 trees
    model = RandomForestRegressor(n_estimators=100, random_state=4)
    
    # Fit the model to the training data
    model.fit(X_train, y_train)

    # Make predictions on the test set to evaluate how well the model performs
    y_pred = model.predict(X_test)

    # Calculate the R2 score
    r2 = r2_score(y_test, y_pred)
    print(f'R2 Score: {r2}')

    # Create evaluation plot
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred, edgecolor='black', color='blue', alpha=0.6)
    plt.title('Actual vs Predicted House Prices')
    plt.xlabel('Actual Prices')
    plt.ylabel('Predicted Prices')
    plt.grid(True)
    
    # Save the plot
    METRICS_PATH.parent.mkdir(exist_ok=True)
    plt.savefig(METRICS_PATH.parent / 'model_evaluation.png')
    plt.close()

    # Save model metrics
    metrics = {
        'r2_score': float(r2),
        'features_used': features,
        'training_samples': len(X_train),
        'test_samples': len(X_test)
    }
    
    # Save metrics to a file
    import json
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f)

    return model

def load_or_train_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    
    # Train model using the exact same code from Assignment 2
    model = train_and_evaluate_model()
    
    # Save the model
    MODEL_PATH.parent.mkdir(exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    return model

# Load or train the model when this file is imported
model = load_or_train_model()

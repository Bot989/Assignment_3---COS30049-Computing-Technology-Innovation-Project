
# Main application file that sets up the FastAPI server and configures basic settings.
# This is the entry point of our backed application.

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.endpoints import prediction
import uvicorn
import logging
from typing import Dict

# Set up logging to help with debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main FastAPI application
app = FastAPI(
    title="Melbourne Housing Price Prediction API",
    description="API for predicting Melbourne house prices using machine learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Allow frontend to communicate with backend (CORS settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect our prediction endpoints to the main app
app.include_router(
    prediction.router,
    prefix="/api",
    tags=["predictions"]
)

# Simple endpoint to check if API is running
@app.get("/", tags=["health"])
async def root() -> Dict[str, str]:
    """Root endpoint to verify API is running"""
    return {"message": "Melbourne Housing Price Prediction API is running"}

# Health check endpoint for monitoring
@app.get("/health", tags=["health"])
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"}

# Handle HTTP errors nicely
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Global HTTP exception handler"""
    logger.error(f"HTTP error occurred: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Handle all other errors
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unexpected error occurred: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred"}
    )

# Run the application if this file is run directly
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


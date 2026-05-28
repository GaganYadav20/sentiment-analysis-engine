"""Health check endpoint."""

from fastapi import APIRouter
from app.services.ml_service import ml_service

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """Return API and model status."""
    return {
        "status": "healthy",
        "model_loaded": ml_service.is_loaded,
        "model_name": ml_service.model_name,
        "version": "1.0.0",
    }

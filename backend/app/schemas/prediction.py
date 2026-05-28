"""Pydantic schemas for prediction requests and responses."""

from pydantic import BaseModel, Field
from datetime import datetime


class PredictionRequest(BaseModel):
    """Input schema for sentiment analysis."""
    text: str = Field(..., min_length=1, max_length=5000, description="Review text to analyze")


class SentimentScores(BaseModel):
    """Breakdown of sentiment scores."""
    positive: float
    neutral: float
    negative: float


class PredictionResponse(BaseModel):
    """Output schema for sentiment analysis."""
    sentiment: str
    confidence: float
    scores: SentimentScores
    processing_time_ms: float
    text: str


class PredictionHistory(BaseModel):
    """Schema for a prediction history entry."""
    id: int
    text: str
    sentiment: str
    confidence: float
    scores: SentimentScores
    processing_time_ms: float
    created_at: datetime

    class Config:
        from_attributes = True


class BatchPredictionResponse(BaseModel):
    """Response for CSV batch analysis."""
    total: int
    results: list[PredictionResponse]
    filename: str

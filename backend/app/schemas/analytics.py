"""Pydantic schemas for analytics responses."""

from pydantic import BaseModel


class SentimentDistribution(BaseModel):
    """Distribution of sentiments across predictions."""
    positive: int
    neutral: int
    negative: int
    total: int


class DailyTrend(BaseModel):
    """Sentiment counts for a single day."""
    date: str
    positive: int
    neutral: int
    negative: int


class ModelMetrics(BaseModel):
    """Model performance metrics."""
    accuracy: float
    precision: float
    recall: float
    f1_score: float


class AnalyticsResponse(BaseModel):
    """Full analytics response."""
    model_config = {"protected_namespaces": ()}

    distribution: SentimentDistribution
    daily_trends: list[DailyTrend]
    model_metrics: ModelMetrics
    avg_confidence: float
    avg_processing_time_ms: float
    total_predictions: int

"""Analytics endpoints."""

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import select, func, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.schemas.analytics import (
    AnalyticsResponse,
    SentimentDistribution,
    DailyTrend,
    ModelMetrics,
)

router = APIRouter(tags=["Analytics"])


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """Return aggregated analytics from prediction history."""

    # Total counts by sentiment
    total_result = await db.execute(select(func.count(Prediction.id)))
    total = total_result.scalar() or 0

    pos_result = await db.execute(
        select(func.count(Prediction.id)).where(Prediction.sentiment == "Positive")
    )
    pos_count = pos_result.scalar() or 0

    neg_result = await db.execute(
        select(func.count(Prediction.id)).where(Prediction.sentiment == "Negative")
    )
    neg_count = neg_result.scalar() or 0

    neu_count = total - pos_count - neg_count

    # Average confidence and processing time
    avg_conf_result = await db.execute(select(func.avg(Prediction.confidence)))
    avg_confidence = round(avg_conf_result.scalar() or 0, 4)

    avg_time_result = await db.execute(select(func.avg(Prediction.processing_time_ms)))
    avg_time = round(avg_time_result.scalar() or 0, 2)

    # Daily trends (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    trends_result = await db.execute(
        select(
            func.date(Prediction.created_at).label("date"),
            Prediction.sentiment,
            func.count(Prediction.id).label("count"),
        )
        .where(Prediction.created_at >= thirty_days_ago)
        .group_by(func.date(Prediction.created_at), Prediction.sentiment)
        .order_by(func.date(Prediction.created_at))
    )

    # Build daily trends map
    trends_map: dict[str, dict] = {}
    for row in trends_result:
        date_str = str(row.date)
        if date_str not in trends_map:
            trends_map[date_str] = {"date": date_str, "positive": 0, "neutral": 0, "negative": 0}
        sentiment_key = row.sentiment.lower()
        if sentiment_key in trends_map[date_str]:
            trends_map[date_str][sentiment_key] = row.count

    daily_trends = [DailyTrend(**v) for v in trends_map.values()]

    # Model metrics (mock values — would come from evaluation in production)
    model_metrics = ModelMetrics(
        accuracy=0.892,
        precision=0.881,
        recall=0.876,
        f1_score=0.878,
    )

    return AnalyticsResponse(
        distribution=SentimentDistribution(
            positive=pos_count,
            neutral=neu_count,
            negative=neg_count,
            total=total,
        ),
        daily_trends=daily_trends,
        model_metrics=model_metrics,
        avg_confidence=avg_confidence,
        avg_processing_time_ms=avg_time,
        total_predictions=total,
    )

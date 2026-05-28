"""Prediction history endpoint."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionHistory, SentimentScores

router = APIRouter(tags=["History"])


@router.get("/history", response_model=list[PredictionHistory])
async def get_history(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Return paginated prediction history, newest first."""
    result = await db.execute(
        select(Prediction)
        .order_by(desc(Prediction.created_at))
        .limit(limit)
        .offset(offset)
    )
    predictions = result.scalars().all()

    return [
        PredictionHistory(
            id=p.id,
            text=p.text,
            sentiment=p.sentiment,
            confidence=p.confidence,
            scores=SentimentScores(
                positive=p.score_positive,
                neutral=p.score_neutral,
                negative=p.score_negative,
            ),
            processing_time_ms=p.processing_time_ms,
            created_at=p.created_at,
        )
        for p in predictions
    ]

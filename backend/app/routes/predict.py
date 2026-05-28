"""Prediction endpoints for sentiment analysis."""

import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.models.uploaded_file import UploadedFile
from app.models.user import User
from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    SentimentScores,
    BatchPredictionResponse,
)
from app.services.ml_service import ml_service
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse)
async def predict_sentiment(
    request: PredictionRequest,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user),
):
    """Analyze sentiment of a single text input."""
    if not ml_service.is_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    result = ml_service.predict(request.text)

    # Save to database
    prediction = Prediction(
        user_id=user.id if user else None,
        text=request.text,
        sentiment=result["sentiment"],
        confidence=result["confidence"],
        score_positive=result["scores"]["positive"],
        score_neutral=result["scores"]["neutral"],
        score_negative=result["scores"]["negative"],
        processing_time_ms=result["processing_time_ms"],
    )
    db.add(prediction)

    return PredictionResponse(
        sentiment=result["sentiment"],
        confidence=result["confidence"],
        scores=SentimentScores(**result["scores"]),
        processing_time_ms=result["processing_time_ms"],
        text=request.text,
    )


@router.post("/upload-csv", response_model=BatchPredictionResponse)
async def upload_csv(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user),
):
    """Upload a CSV file and analyze all reviews in batch."""
    if not ml_service.is_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    # Read CSV
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    # Find text column
    text_col = None
    for col in ["text", "review", "content", "comment", "body", "message"]:
        if col in df.columns.str.lower():
            text_col = df.columns[df.columns.str.lower() == col][0]
            break

    if text_col is None:
        if len(df.columns) >= 1:
            text_col = df.columns[0]
        else:
            raise HTTPException(status_code=400, detail="No text column found in CSV")

    # Track upload
    uploaded = UploadedFile(
        user_id=user.id if user else None,
        filename=file.filename,
        row_count=len(df),
    )
    db.add(uploaded)

    # Analyze each row (limit to 500 for performance)
    results = []
    for _, row in df.head(500).iterrows():
        text = str(row[text_col]).strip()
        if not text or text == "nan":
            continue

        result = ml_service.predict(text)

        # Save prediction
        pred = Prediction(
            user_id=user.id if user else None,
            text=text,
            sentiment=result["sentiment"],
            confidence=result["confidence"],
            score_positive=result["scores"]["positive"],
            score_neutral=result["scores"]["neutral"],
            score_negative=result["scores"]["negative"],
            processing_time_ms=result["processing_time_ms"],
        )
        db.add(pred)

        results.append(PredictionResponse(
            sentiment=result["sentiment"],
            confidence=result["confidence"],
            scores=SentimentScores(**result["scores"]),
            processing_time_ms=result["processing_time_ms"],
            text=text,
        ))

    return BatchPredictionResponse(
        total=len(results),
        results=results,
        filename=file.filename,
    )

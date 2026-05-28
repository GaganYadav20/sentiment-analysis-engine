"""Machine Learning service for sentiment analysis inference."""

import time
import logging
from transformers import pipeline

from app.config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class MLService:
    """Singleton service that loads and runs the sentiment analysis model."""

    def __init__(self):
        self.model = None
        self.model_name = settings.MODEL_NAME
        self._is_loaded = False

    async def load_model(self):
        """Load the HuggingFace sentiment analysis pipeline in a background thread."""
        import asyncio
        try:
            logger.info(f"Loading model: {self.model_name}")
            self.model = await asyncio.to_thread(
                pipeline,
                "sentiment-analysis",
                model=self.model_name,
                tokenizer=self.model_name,
                top_k=None,  # Return all class scores
                device=-1,   # CPU
            )
            self._is_loaded = True
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    def predict(self, text: str) -> dict:
        """
        Run sentiment analysis on input text.

        The nlptown model returns 1-5 star ratings. We map them to:
        - 1-2 stars → Negative
        - 3 stars   → Neutral
        - 4-5 stars → Positive

        Returns dict with sentiment, confidence, scores, and timing.
        """
        if not self._is_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        start = time.perf_counter()

        # Truncate text to model max length
        truncated = text[:512]
        raw_scores = self.model(truncated)[0]

        # Map star ratings to 3-class sentiment
        score_map = {item["label"]: item["score"] for item in raw_scores}

        negative_score = score_map.get("1 star", 0) + score_map.get("2 stars", 0)
        neutral_score = score_map.get("3 stars", 0)
        positive_score = score_map.get("4 stars", 0) + score_map.get("5 stars", 0)

        # Normalize to sum=1
        total = negative_score + neutral_score + positive_score
        if total > 0:
            negative_score /= total
            neutral_score /= total
            positive_score /= total

        # Determine dominant sentiment
        scores = {
            "positive": round(positive_score, 4),
            "neutral": round(neutral_score, 4),
            "negative": round(negative_score, 4),
        }
        sentiment = max(scores, key=scores.get).capitalize()
        confidence = max(scores.values())

        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

        return {
            "sentiment": sentiment,
            "confidence": round(confidence, 4),
            "scores": scores,
            "processing_time_ms": elapsed_ms,
            "text": text,
        }


# Singleton instance
ml_service = MLService()

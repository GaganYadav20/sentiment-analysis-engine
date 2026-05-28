"""
Standalone inference script for testing saved sentiment models.

Usage:
    python inference.py --text "This product is amazing!"
    python inference.py --model_path saved_model/best --text "Terrible quality"
"""

import argparse
from transformers import pipeline


def predict(text: str, model_path: str = "nlptown/bert-base-multilingual-uncased-sentiment"):
    """Run sentiment inference on input text."""

    print(f"Loading model: {model_path}")
    classifier = pipeline(
        "sentiment-analysis",
        model=model_path,
        tokenizer=model_path,
        top_k=None,
        device=-1,
    )

    results = classifier(text[:512])[0]

    # Map star ratings to 3-class
    score_map = {r["label"]: r["score"] for r in results}

    neg = score_map.get("1 star", 0) + score_map.get("2 stars", 0)
    neu = score_map.get("3 stars", 0)
    pos = score_map.get("4 stars", 0) + score_map.get("5 stars", 0)

    total = neg + neu + pos
    if total > 0:
        neg /= total
        neu /= total
        pos /= total

    scores = {"positive": round(pos, 4), "neutral": round(neu, 4), "negative": round(neg, 4)}
    sentiment = max(scores, key=scores.get)

    print(f"\nText: {text}")
    print(f"Sentiment: {sentiment.upper()}")
    print(f"Confidence: {scores[sentiment]:.2%}")
    print(f"Scores: {scores}")

    return {"sentiment": sentiment, "confidence": scores[sentiment], "scores": scores}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run sentiment inference")
    parser.add_argument("--text", type=str, required=True, help="Text to analyze")
    parser.add_argument("--model_path", type=str, default="nlptown/bert-base-multilingual-uncased-sentiment")
    args = parser.parse_args()
    predict(args.text, args.model_path)

"""
Evaluate a fine-tuned BERT sentiment model.

Usage:
    python evaluate.py --model_path saved_model/best
"""

import argparse
import pandas as pd
import numpy as np
from datasets import Dataset
from transformers import BertTokenizer, BertForSequenceClassification, Trainer
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

LABEL_MAP = {"negative": 0, "neutral": 1, "positive": 2}
ID_TO_LABEL = {v: k for k, v in LABEL_MAP.items()}


def main(args):
    print(f"Evaluating model from: {args.model_path}")

    # Load model and tokenizer
    tokenizer = BertTokenizer.from_pretrained(args.model_path)
    model = BertForSequenceClassification.from_pretrained(args.model_path)

    # Load test data
    test_df = pd.read_csv("dataset/test.csv")
    test_df["label"] = test_df["label"].map(LABEL_MAP)
    test_df = test_df.dropna(subset=["text", "label"])

    dataset = Dataset.from_pandas(test_df[["text", "label"]])

    def tokenize_fn(examples):
        return tokenizer(
            examples["text"],
            padding="max_length",
            truncation=True,
            max_length=256,
        )

    dataset = dataset.map(tokenize_fn, batched=True)
    dataset.set_format("torch", columns=["input_ids", "attention_mask", "label"])

    # Predict
    trainer = Trainer(model=model)
    predictions = trainer.predict(dataset)
    preds = np.argmax(predictions.predictions, axis=-1)
    labels = predictions.label_ids

    # Metrics
    print("\n" + "=" * 60)
    print("CLASSIFICATION REPORT")
    print("=" * 60)
    print(classification_report(labels, preds, target_names=list(LABEL_MAP.keys())))

    print("\nCONFUSION MATRIX")
    print(confusion_matrix(labels, preds))

    accuracy = accuracy_score(labels, preds)
    print(f"\nOverall Accuracy: {accuracy:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate sentiment model")
    parser.add_argument("--model_path", type=str, default="saved_model/best")
    args = parser.parse_args()
    main(args)

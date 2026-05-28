"""
Fine-tune BERT for 3-class sentiment analysis using HuggingFace Trainer API.

Usage:
    python train.py --epochs 3 --batch_size 16 --lr 2e-5

Prerequisites:
    Run preprocess.py first to generate dataset/train.csv and dataset/test.csv
"""

import argparse
import os
import numpy as np
import pandas as pd
from datasets import Dataset
from transformers import (
    BertForSequenceClassification,
    BertTokenizer,
    Trainer,
    TrainingArguments,
)
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

MODEL_NAME = "bert-base-uncased"
LABEL_MAP = {"negative": 0, "neutral": 1, "positive": 2}
ID_TO_LABEL = {v: k for k, v in LABEL_MAP.items()}
NUM_LABELS = 3


def compute_metrics(eval_pred):
    """Compute accuracy, precision, recall, and F1 for evaluation."""
    predictions, labels = eval_pred
    preds = np.argmax(predictions, axis=-1)
    accuracy = accuracy_score(labels, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average="weighted"
    )
    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
    }


def main(args):
    print(f"Fine-tuning {MODEL_NAME} for {NUM_LABELS}-class sentiment analysis")

    # Load data
    train_df = pd.read_csv("dataset/train.csv")
    test_df = pd.read_csv("dataset/test.csv")

    # Map labels to integers
    train_df["label"] = train_df["label"].map(LABEL_MAP)
    test_df["label"] = test_df["label"].map(LABEL_MAP)

    # Drop any NaN
    train_df = train_df.dropna(subset=["text", "label"])
    test_df = test_df.dropna(subset=["text", "label"])

    # Convert to HuggingFace Dataset
    train_dataset = Dataset.from_pandas(train_df[["text", "label"]])
    test_dataset = Dataset.from_pandas(test_df[["text", "label"]])

    # Tokenizer
    tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)

    def tokenize_fn(examples):
        return tokenizer(
            examples["text"],
            padding="max_length",
            truncation=True,
            max_length=256,
        )

    train_dataset = train_dataset.map(tokenize_fn, batched=True)
    test_dataset = test_dataset.map(tokenize_fn, batched=True)

    # Set format for PyTorch
    train_dataset.set_format("torch", columns=["input_ids", "attention_mask", "label"])
    test_dataset.set_format("torch", columns=["input_ids", "attention_mask", "label"])

    # Model
    model = BertForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=NUM_LABELS,
        id2label=ID_TO_LABEL,
        label2id=LABEL_MAP,
    )

    # Training arguments
    training_args = TrainingArguments(
        output_dir="./saved_model",
        eval_strategy="epoch",
        save_strategy="epoch",
        learning_rate=args.lr,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        num_train_epochs=args.epochs,
        weight_decay=0.01,
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        logging_dir="./logs",
        logging_steps=100,
        report_to="none",
        fp16=True,  # Set True if GPU supports it
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
        compute_metrics=compute_metrics,
    )

    # Train
    print("Starting training...")
    trainer.train()

    # Save best model
    save_path = os.path.join("saved_model", "best")
    trainer.save_model(save_path)
    tokenizer.save_pretrained(save_path)
    print(f"Model saved to {save_path}")

    # Final evaluation
    results = trainer.evaluate()
    print("\nFinal Evaluation Results:")
    for key, value in results.items():
        print(f"  {key}: {value:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune BERT for sentiment analysis")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=16, help="Training batch size")
    parser.add_argument("--lr", type=float, default=2e-5, help="Learning rate")
    args = parser.parse_args()
    main(args)

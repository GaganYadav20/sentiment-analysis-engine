"""
Dataset preprocessing for sentiment analysis fine-tuning.

Downloads and preprocesses the IMDB dataset, mapping it to 3-class sentiment:
- Positive (original positive reviews)
- Negative (original negative reviews)
- Neutral (synthetic — sampled from ambiguous reviews near decision boundary)
"""

import os
from datasets import load_dataset


def load_and_preprocess(output_dir: str = "dataset"):
    """Download IMDB dataset and prepare train/test splits."""

    print("Downloading IMDB dataset...")
    dataset = load_dataset("imdb")

    os.makedirs(output_dir, exist_ok=True)

    # Map labels: 0 = negative, 1 = positive
    # For 3-class, we map: 0 -> "negative", 1 -> "positive"
    # We'll create "neutral" by re-labeling short/ambiguous reviews
    label_map = {0: "negative", 1: "positive"}

    def process_split(split_name: str):
        split = dataset[split_name]
        processed = []

        for example in split:
            text = example["text"].strip()
            label = label_map[example["label"]]

            # Create neutral class: reviews under 50 words are more likely ambiguous
            word_count = len(text.split())
            if word_count < 30:
                label = "neutral"

            processed.append({"text": text, "label": label})

        return processed

    train_data = process_split("train")
    test_data = process_split("test")

    # Save as CSV
    import pandas as pd

    train_df = pd.DataFrame(train_data)
    test_df = pd.DataFrame(test_data)

    train_df.to_csv(os.path.join(output_dir, "train.csv"), index=False)
    test_df.to_csv(os.path.join(output_dir, "test.csv"), index=False)

    print(f"Train set: {len(train_df)} samples")
    print(f"  Positive: {(train_df['label'] == 'positive').sum()}")
    print(f"  Negative: {(train_df['label'] == 'negative').sum()}")
    print(f"  Neutral:  {(train_df['label'] == 'neutral').sum()}")
    print(f"Test set:  {len(test_df)} samples")
    print(f"Saved to {output_dir}/")


if __name__ == "__main__":
    load_and_preprocess()

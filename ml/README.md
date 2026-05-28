# Sentiment Analysis — ML Training Pipeline

## Overview

This directory contains the complete ML pipeline for fine-tuning BERT for 3-class sentiment analysis (Positive / Neutral / Negative).

## Files

| File | Purpose |
|------|---------|
| `preprocess.py` | Downloads IMDB dataset and maps to 3-class format |
| `tokenizer.py` | BERT tokenization utilities |
| `train.py` | Fine-tuning script using HuggingFace Trainer API |
| `evaluate.py` | Model evaluation with classification metrics |
| `inference.py` | Standalone inference for testing |

## Quick Start

```bash
# 1. Install dependencies
pip install transformers torch datasets pandas scikit-learn

# 2. Preprocess dataset
python preprocess.py

# 3. Train model
python train.py --epochs 3 --batch_size 16 --lr 2e-5

# 4. Evaluate
python evaluate.py --model_path saved_model/best

# 5. Test inference
python inference.py --text "This product is fantastic!"
```

## Model Details

- **Base Model**: `bert-base-uncased`
- **Task**: Multi-class sequence classification (3 classes)
- **Classes**: Positive, Neutral, Negative
- **Max Sequence Length**: 256 tokens

## Pre-trained Alternative

For immediate use without training, the backend uses `nlptown/bert-base-multilingual-uncased-sentiment` from HuggingFace Hub, which provides 5-star sentiment ratings mapped to 3 classes.

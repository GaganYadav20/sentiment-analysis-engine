"""
Tokenization utilities for BERT sentiment analysis.

Provides a tokenization function compatible with HuggingFace Trainer API.
"""

from transformers import BertTokenizer

MODEL_NAME = "bert-base-uncased"
MAX_LENGTH = 256


def get_tokenizer():
    """Load the BERT tokenizer."""
    return BertTokenizer.from_pretrained(MODEL_NAME)


def tokenize_function(examples, tokenizer=None):
    """
    Tokenize a batch of text examples for BERT.

    Args:
        examples: Dict with 'text' key containing list of strings
        tokenizer: BertTokenizer instance

    Returns:
        Tokenized inputs with attention masks
    """
    if tokenizer is None:
        tokenizer = get_tokenizer()

    return tokenizer(
        examples["text"],
        padding="max_length",
        truncation=True,
        max_length=MAX_LENGTH,
        return_tensors=None,
    )


def tokenize_single(text: str, tokenizer=None):
    """Tokenize a single text input for inference."""
    if tokenizer is None:
        tokenizer = get_tokenizer()

    return tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=MAX_LENGTH,
        return_tensors="pt",
    )

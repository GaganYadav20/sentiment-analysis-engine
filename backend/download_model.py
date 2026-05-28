"""Pre-download the BERT model to cache so the server starts instantly."""
import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "nlptown/bert-base-multilingual-uncased-sentiment"

print(f"Pre-downloading model: {model_name}")
print("Downloading tokenizer...")
AutoTokenizer.from_pretrained(model_name)
print("Tokenizer downloaded!")

print("Downloading model weights (~700MB)...")
AutoModelForSequenceClassification.from_pretrained(model_name)
print("Model downloaded!")

print("\nAll model files cached. Server will start instantly next time.")

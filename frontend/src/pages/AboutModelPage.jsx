import { motion } from 'framer-motion'
import { Brain, Cpu, BookOpen, Layers, Code, GitBranch, Sparkles, ArrowRight } from 'lucide-react'
import GlassCard from '../components/GlassCard'

const SECTIONS = [
  {
    icon: BookOpen,
    title: 'Natural Language Processing (NLP)',
    color: '#3b82f6',
    content: `NLP is a branch of artificial intelligence that helps computers understand, interpret, and generate human language. It combines computational linguistics with statistical, machine learning, and deep learning models to process text and speech data.`,
    details: [
      'Text Classification & Sentiment Analysis',
      'Named Entity Recognition (NER)',
      'Machine Translation',
      'Question Answering Systems',
    ],
  },
  {
    icon: Brain,
    title: 'BERT — Bidirectional Encoder Representations from Transformers',
    color: '#8b5cf6',
    content: `BERT is a groundbreaking language model developed by Google in 2018. Unlike previous models that read text left-to-right or right-to-left, BERT reads the entire sequence of words at once (bidirectional), allowing it to understand the full context of a word based on its surroundings.`,
    details: [
      '110M parameters (base model)',
      'Pre-trained on BookCorpus + Wikipedia (3.3B words)',
      'Masked Language Modeling (MLM) objective',
      'Next Sentence Prediction (NSP) objective',
    ],
    code: `from transformers import BertTokenizer, BertModel

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

inputs = tokenizer("Hello world!", return_tensors="pt")
outputs = model(**inputs)`,
  },
  {
    icon: Layers,
    title: 'Transformer Architecture',
    color: '#06b6d4',
    content: `The Transformer architecture, introduced in the paper "Attention Is All You Need" (2017), revolutionized NLP by replacing recurrence with self-attention mechanisms. This enables parallel processing of input sequences and better capture of long-range dependencies.`,
    details: [
      'Self-Attention Mechanism — relates every token to every other token',
      'Multi-Head Attention — learns different representation subspaces',
      'Positional Encoding — injects sequence order information',
      'Feed-Forward Networks — non-linear transformations per position',
      'Layer Normalization — stabilizes training',
      'Residual Connections — enables gradient flow in deep networks',
    ],
  },
  {
    icon: Sparkles,
    title: 'Attention Mechanism',
    color: '#ec4899',
    content: `The attention mechanism computes a weighted sum of values, where the weights are determined by the compatibility of queries and keys. In self-attention, Q, K, V all come from the same input sequence.`,
    code: `# Scaled Dot-Product Attention
# Attention(Q, K, V) = softmax(QK^T / √d_k) V

import torch
import torch.nn.functional as F

def attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / d_k**0.5
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V)`,
    details: [
      'Query (Q) — what am I looking for?',
      'Key (K) — what do I contain?',
      'Value (V) — what information do I provide?',
      'Scaling factor √d_k prevents softmax saturation',
    ],
  },
  {
    icon: Code,
    title: 'Tokenization',
    color: '#f59e0b',
    content: `BERT uses WordPiece tokenization to convert text into subword tokens. This handles out-of-vocabulary words by breaking them into known subword units. Special tokens [CLS] and [SEP] mark the beginning and separation of sentences.`,
    code: `from transformers import BertTokenizer

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

text = "The product quality is outstanding!"
tokens = tokenizer.tokenize(text)
# ['the', 'product', 'quality', 'is', 'outstanding', '!']

ids = tokenizer.encode(text)
# [101, 1996, 4031, 3737, 2003, 7840, 999, 102]
# [CLS] the product quality is outstanding ! [SEP]`,
    details: [
      'Vocabulary size: 30,522 tokens',
      '[CLS] — classification token (sentence-level representation)',
      '[SEP] — separator token between sentences',
      '[MASK] — used during pre-training (MLM)',
      '[PAD] — padding to fixed length',
    ],
  },
  {
    icon: GitBranch,
    title: 'Fine-Tuning for Sentiment Analysis',
    color: '#10b981',
    content: `Fine-tuning adapts a pre-trained BERT model to a specific downstream task. For sentiment analysis, we add a classification head on top of the [CLS] token output and train on labeled sentiment data.`,
    code: `from transformers import BertForSequenceClassification, Trainer

# Load pre-trained BERT with classification head
model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased',
    num_labels=3,  # Positive, Neutral, Negative
)

# Fine-tune with Trainer API
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    compute_metrics=compute_metrics,
)
trainer.train()`,
    details: [
      'Freeze early layers, fine-tune later layers',
      'Lower learning rate (2e-5 to 5e-5)',
      'Typically 3-4 epochs is sufficient',
      'Evaluation: Accuracy, Precision, Recall, F1',
    ],
  },
  {
    icon: Cpu,
    title: 'HuggingFace Transformers Library',
    color: '#3b82f6',
    content: `HuggingFace Transformers provides thousands of pre-trained models and a unified API for NLP tasks. It supports PyTorch, TensorFlow, and JAX, with tools for training, inference, and model sharing via the HuggingFace Hub.`,
    details: [
      '200K+ pre-trained models on HuggingFace Hub',
      'Pipeline API for zero-code inference',
      'Trainer API for fine-tuning',
      'AutoModel/AutoTokenizer for automatic model detection',
      'ONNX export for optimized inference',
      'Supported frameworks: PyTorch, TensorFlow, JAX',
    ],
    code: `from transformers import pipeline

# Zero-code sentiment analysis
classifier = pipeline("sentiment-analysis")
result = classifier("This product is amazing!")
# [{'label': 'POSITIVE', 'score': 0.9998}]`,
  },
]

const TIMELINE = [
  { year: '2017', event: 'Transformer architecture introduced (Attention Is All You Need)' },
  { year: '2018', event: 'BERT released by Google, achieving SOTA on 11 NLP benchmarks' },
  { year: '2019', event: 'RoBERTa, DistilBERT, ALBERT — BERT variants emerge' },
  { year: '2020', event: 'GPT-3 demonstrates few-shot learning; T5 unifies NLP as text-to-text' },
  { year: '2022', event: 'ChatGPT launches, bringing LLMs to mainstream' },
  { year: '2024+', event: 'Efficient fine-tuning (LoRA, QLoRA), open-source models proliferate' },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AboutModelPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}>
          <span className="gradient-text">About the Model</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Explore the NLP concepts and architecture behind the Sentiment Analysis Engine
        </p>
      </motion.div>

      {/* Sections */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        {SECTIONS.map((section, index) => (
          <motion.div key={section.title} variants={item}>
            <GlassCard hover={false}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: `${section.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${section.color}30`,
                  flexShrink: 0,
                }}>
                  <section.icon size={20} style={{ color: section.color }} />
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                  {section.title}
                </h2>
              </div>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                marginBottom: '1rem',
              }}>
                {section.content}
              </p>

              {/* Key points */}
              {section.details && (
                <div style={{ marginBottom: section.code ? '1rem' : 0 }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}>
                    {section.details.map((detail, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                      }}>
                        <ArrowRight size={14} style={{ color: section.color, flexShrink: 0, marginTop: '2px' }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code snippet */}
              {section.code && (
                <div style={{
                  background: 'rgba(6, 11, 24, 0.8)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  overflow: 'auto',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.4rem',
                    marginBottom: '0.75rem',
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <pre style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--color-neon-cyan)',
                    margin: 0,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {section.code}
                  </pre>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}

        {/* Timeline */}
        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              📅 NLP Timeline
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'var(--color-accent-blue)',
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                    }} />
                    {i < TIMELINE.length - 1 && (
                      <div style={{
                        width: '2px',
                        height: '32px',
                        background: 'var(--color-border)',
                      }} />
                    )}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--color-accent-blue)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {t.year}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {t.event}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Minus, Clock, Zap } from 'lucide-react'

const SENTIMENT_CONFIG = {
  Positive: {
    icon: ThumbsUp,
    color: 'var(--color-positive)',
    emoji: '😊',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    explanation: 'The review expresses satisfaction, praise, or positive experience with the product.',
  },
  Negative: {
    icon: ThumbsDown,
    color: 'var(--color-negative)',
    emoji: '😞',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    explanation: 'The review expresses dissatisfaction, complaints, or negative experience with the product.',
  },
  Neutral: {
    icon: Minus,
    color: 'var(--color-neutral)',
    emoji: '😐',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    explanation: 'The review is balanced or factual without strong positive or negative sentiment.',
  },
}

export default function PredictionCard({ result }) {
  if (!result) return null

  const config = SENTIMENT_CONFIG[result.sentiment] || SENTIMENT_CONFIG.Neutral
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="glass-card"
      style={{
        padding: '2rem',
        borderLeft: `4px solid ${config.color}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: config.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${config.border}`,
            }}
          >
            <Icon size={24} style={{ color: config.color }} />
          </motion.div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: config.color }}>
              {config.emoji} {result.sentiment}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={12} />
              {result.processing_time_ms}ms
              <Zap size={12} />
              BERT Transformer
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '2rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          color: config.color,
        }}>
          {(result.confidence * 100).toFixed(1)}%
        </div>
      </div>

      {/* Confidence Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Positive', value: result.scores.positive, cls: 'progress-positive' },
          { label: 'Neutral', value: result.scores.neutral, cls: 'progress-neutral' },
          { label: 'Negative', value: result.scores.negative, cls: 'progress-negative' },
        ].map(bar => (
          <div key={bar.label}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.3rem',
            }}>
              <span>{bar.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{(bar.value * 100).toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.value * 100}%` }}
                transition={{ duration: 1, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className={`progress-bar-fill ${bar.cls}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Explanation */}
      <div style={{
        padding: '1rem',
        background: 'rgba(99, 102, 241, 0.05)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent-blue)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          AI Explanation
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {config.explanation}
        </p>
      </div>
    </motion.div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, RotateCcw, History, Download, FileText } from 'lucide-react'
import { useAnalysis, useHistory } from '../hooks/useAnalysis'
import { useExport } from '../hooks/useExport'
import { useToast } from '../context/ToastContext'
import PredictionCard from '../components/PredictionCard'
import CSVUpload from '../components/CSVUpload'
import Loader from '../components/Loader'
import GlassCard from '../components/GlassCard'

export default function DashboardPage() {
  const [text, setText] = useState('')
  const [showCSV, setShowCSV] = useState(false)
  const { result, loading, error, analyze, reset } = useAnalysis()
  const { history, loading: historyLoading, fetchHistory } = useHistory()
  const { exportToCSV } = useExport()
  const { addToast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleAnalyze = async () => {
    if (!text.trim()) {
      addToast('Please enter a review to analyze', 'error')
      return
    }
    try {
      await analyze(text)
      addToast('Analysis complete!', 'success')
      fetchHistory()
    } catch (e) {
      addToast('Analysis failed — check if the backend is running', 'error')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAnalyze()
    }
  }

  const handleCSVResults = (data) => {
    fetchHistory()
  }

  const handleReset = () => {
    setText('')
    reset()
  }

  const sentimentColor = (s) => {
    if (s === 'Positive') return 'var(--color-positive)'
    if (s === 'Negative') return 'var(--color-negative)'
    return 'var(--color-neutral)'
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}>
          <span className="gradient-text">Sentiment Dashboard</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Enter a product review to analyze its sentiment in real time
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard hover={false}>
            <textarea
              id="review-input"
              className="input-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste a product review here... (Ctrl+Enter to analyze)"
              style={{ minHeight: '140px', marginBottom: '1rem', fontSize: '0.95rem' }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <button
                id="analyze-btn"
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                <Send size={16} />
                {loading ? 'Analyzing...' : 'Analyze Sentiment'}
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                <RotateCcw size={16} /> Reset
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowCSV(!showCSV)}
              >
                <FileText size={16} /> {showCSV ? 'Hide CSV Upload' : 'Upload CSV'}
              </button>
              {history.length > 0 && (
                <button
                  className="btn-secondary"
                  onClick={() => exportToCSV(history)}
                >
                  <Download size={16} /> Export
                </button>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* CSV Upload */}
        {showCSV && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CSVUpload onResults={handleCSVResults} />
          </motion.div>
        )}

        {/* Loading */}
        {loading && <Loader />}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card"
            style={{
              padding: '1.25rem',
              borderLeft: '4px solid var(--color-negative)',
              color: 'var(--color-negative)',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Result */}
        {result && !loading && <PredictionCard result={result} />}

        {/* Quick examples */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Try these examples:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[
                'This product is absolutely amazing! Best purchase I ever made.',
                'Terrible quality. Broke after two days. Complete waste of money.',
                'It works fine. Nothing special but does the job as expected.',
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setText(example)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                    background: 'rgba(15, 23, 55, 0.4)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--color-accent-blue)'
                    e.target.style.color = 'var(--color-text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.color = 'var(--color-text-secondary)'
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* History Table */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover={false}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <History size={18} style={{ color: 'var(--color-accent-blue)' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Prediction History</h2>
                <span style={{
                  fontSize: '0.75rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--color-accent-blue)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {history.length}
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.85rem',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      {['Text', 'Sentiment', 'Confidence', 'Time'].map(h => (
                        <th key={h} style={{
                          textAlign: 'left',
                          padding: '0.75rem 0.5rem',
                          color: 'var(--color-text-muted)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 20).map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{
                          padding: '0.75rem 0.5rem',
                          maxWidth: '400px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--color-text-primary)',
                        }}>
                          {item.text}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: sentimentColor(item.sentiment),
                            background: `${sentimentColor(item.sentiment)}15`,
                            border: `1px solid ${sentimentColor(item.sentiment)}30`,
                          }}>
                            {item.sentiment}
                          </span>
                        </td>
                        <td style={{
                          padding: '0.75rem 0.5rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--color-text-secondary)',
                        }}>
                          {(item.confidence * 100).toFixed(1)}%
                        </td>
                        <td style={{
                          padding: '0.75rem 0.5rem',
                          color: 'var(--color-text-muted)',
                          fontSize: '0.8rem',
                        }}>
                          {item.processing_time_ms}ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}

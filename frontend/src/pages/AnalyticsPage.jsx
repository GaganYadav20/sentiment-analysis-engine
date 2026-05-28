import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, PieChart, Target, Clock, Gauge, AlertCircle, RefreshCw } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalysis'
import StatCard from '../components/StatCard'
import GlassCard from '../components/GlassCard'
import Loader from '../components/Loader'
import SentimentPieChart from '../charts/SentimentPieChart'
import TrendAreaChart from '../charts/TrendAreaChart'
import ConfidenceBarChart from '../charts/ConfidenceBarChart'
import ModelMetricsRadar from '../charts/ModelMetricsRadar'

export default function AnalyticsPage() {
  const { analytics, loading, error, fetchAnalytics } = useAnalytics()

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <Loader text="Loading analytics..." />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2rem',
            borderLeft: '4px solid var(--color-negative)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={40} style={{ color: 'var(--color-negative)' }} />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-negative)', marginBottom: '0.5rem' }}>
              Failed to Load Analytics
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{error}</p>
          </div>
          <button
            id="retry-analytics-btn"
            className="btn-secondary"
            onClick={fetchAnalytics}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={15} /> Retry
          </button>
        </motion.div>
      </div>
    )
  }

  const dist = analytics?.distribution || { positive: 0, neutral: 0, negative: 0, total: 0 }
  const total = dist.total || 1

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
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
          <span className="gradient-text">Analytics Dashboard</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Comprehensive sentiment analysis metrics and trends
        </p>
      </motion.div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <StatCard icon={BarChart3} label="Total Reviews" value={analytics?.total_predictions || 0} color="#3b82f6" delay={0} />
        <StatCard icon={TrendingUp} label="Positive Rate" value={total > 0 ? ((dist.positive / total) * 100).toFixed(1) : 0} suffix="%" color="#10b981" delay={0.05} />
        <StatCard icon={Target} label="Avg Confidence" value={analytics?.avg_confidence ? (analytics.avg_confidence * 100).toFixed(1) : 0} suffix="%" color="#8b5cf6" delay={0.1} />
        <StatCard icon={Clock} label="Avg Response" value={analytics?.avg_processing_time_ms?.toFixed(0) || 0} suffix="ms" color="#06b6d4" delay={0.15} />
      </div>

      {/* Sentiment breakdown mini-cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Positive', value: dist.positive, pct: ((dist.positive / total) * 100).toFixed(1), color: 'var(--color-positive)', emoji: '😊' },
          { label: 'Neutral', value: dist.neutral, pct: ((dist.neutral / total) * 100).toFixed(1), color: 'var(--color-neutral)', emoji: '😐' },
          { label: 'Negative', value: dist.negative, pct: ((dist.negative / total) * 100).toFixed(1), color: 'var(--color-negative)', emoji: '😞' },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: s.color,
              }}>
                {s.pct}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {s.label} ({s.value})
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        {/* Pie Chart */}
        <GlassCard hover={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <PieChart size={18} style={{ color: 'var(--color-accent-blue)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Sentiment Distribution</h3>
          </div>
          <SentimentPieChart data={dist} />
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard hover={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--color-accent-cyan)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Count by Sentiment</h3>
          </div>
          <ConfidenceBarChart data={dist} />
        </GlassCard>
      </div>

      {/* Full-width charts */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Area Chart — Trends */}
        <GlassCard hover={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-accent-purple)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Daily Sentiment Trends</h3>
          </div>
          <TrendAreaChart data={analytics?.daily_trends || []} />
        </GlassCard>

        {/* Radar — Model Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}>
          <GlassCard hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Gauge size={18} style={{ color: 'var(--color-accent-purple)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Model Performance</h3>
            </div>
            <ModelMetricsRadar metrics={analytics?.model_metrics} />
          </GlassCard>

          {/* Model Metrics Table */}
          <GlassCard hover={false}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem' }}>Detailed Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics?.model_metrics && Object.entries(analytics.model_metrics).map(([key, val]) => (
                <div key={key}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: '0.3rem',
                  }}>
                    <span style={{ color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                      {key.replace('_', ' ')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {(val * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="progress-bar-fill"
                      style={{
                        background: `linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-blue))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, BarChart3, Sparkles, Zap, Shield, Globe, ArrowRight, ChevronDown } from 'lucide-react'
import FloatingParticles from '../components/FloatingParticles'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'

// Typing animation hook
function useTypingAnimation(texts, speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    let timeout

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, speed)
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      }, speed / 2)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setTextIndex((textIndex + 1) % texts.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, textIndex, texts, speed, pause])

  return displayed
}

const TYPING_TEXTS = [
  'Product Reviews',
  'Customer Feedback',
  'Social Media Posts',
  'App Store Reviews',
]

const FEATURES = [
  {
    icon: Brain,
    title: 'BERT Transformer',
    description: 'Fine-tuned BERT model for accurate multi-class sentiment classification with state-of-the-art NLP.',
    color: '#8b5cf6',
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Get instant sentiment predictions with confidence scores in milliseconds via optimized inference.',
    color: '#06b6d4',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Interactive charts, trend analysis, and model performance metrics at your fingertips.',
    color: '#10b981',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Enterprise-grade FastAPI backend with JWT authentication, database persistence, and Docker support.',
    color: '#f59e0b',
  },
  {
    icon: Globe,
    title: 'Batch Processing',
    description: 'Upload CSV datasets for bulk sentiment analysis with exportable results and analytics.',
    color: '#ec4899',
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    description: 'Automated explanations, confidence scoring, and sentiment distribution across your data.',
    color: '#3b82f6',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  const typedText = useTypingAnimation(TYPING_TEXTS)

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <FloatingParticles count={60} />

        {/* Decorative orbs */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          top: '10%',
          left: '-10%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          bottom: '5%',
          right: '-5%',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '2rem 1.5rem',
        }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              color: 'var(--color-neon-blue)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} />
            Powered by BERT Transformer
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            <span className="gradient-text">Sentiment Analysis</span>
            <br />
            <span style={{ color: 'var(--color-text-primary)' }}>Engine</span>
          </motion.h1>

          {/* Subtitle with typing */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '0.75rem',
              maxWidth: '620px',
              margin: '0 auto 0.75rem',
            }}
          >
            Fine-tuned BERT model for multi-class sentiment analysis on
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
              fontWeight: 700,
              color: 'var(--color-neon-cyan)',
              fontFamily: 'var(--font-mono)',
              minHeight: '2rem',
              marginBottom: '2rem',
            }}
          >
            {typedText}<span style={{ animation: 'pulse-glow 1s infinite' }}>|</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '3rem',
            }}
          >
            <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Try Demo <ArrowRight size={18} />
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              View GitHub
            </a>
            <Link to="/analytics" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Explore Analytics
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          <StatCard icon={Brain} label="Model Parameters" value="110" suffix="M" color="#8b5cf6" delay={0} />
          <StatCard icon={Zap} label="Avg Response Time" value="45" suffix="ms" color="#06b6d4" delay={0.1} />
          <StatCard icon={BarChart3} label="Model Accuracy" value="89.2" suffix="%" color="#10b981" delay={0.2} />
          <StatCard icon={Shield} label="API Uptime" value="99.9" suffix="%" color="#f59e0b" delay={0.3} />
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 1.5rem 5rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 800,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Everything you need for production-grade sentiment analysis
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {FEATURES.map((feature, index) => (
            <motion.div key={feature.title} variants={item}>
              <GlassCard delay={0} style={{ height: '100%' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: `${feature.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  border: `1px solid ${feature.color}30`,
                }}>
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-primary)',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}

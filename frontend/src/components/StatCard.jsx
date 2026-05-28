import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function StatCard({ icon: Icon, label, value, suffix = '', color = 'var(--color-accent-blue)', delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setDisplayValue(value)
      return
    }

    const duration = 1500
    const start = performance.now()
    const isFloat = value.toString().includes('.')

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = numValue * eased
      setDisplayValue(isFloat ? current.toFixed(1) : Math.round(current))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-md)',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          lineHeight: 1.2,
          fontFamily: 'var(--font-mono)',
        }}>
          {displayValue}{suffix}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.25rem',
        }}>
          {label}
        </div>
      </div>
    </motion.div>
  )
}

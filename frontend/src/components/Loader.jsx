import { motion } from 'framer-motion'

export default function Loader({ text = 'Analyzing sentiment...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.25rem',
      padding: '2rem',
    }}>
      {/* Animated rings */}
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'var(--color-accent-blue)',
            borderRightColor: 'var(--color-accent-purple)',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: 'var(--color-accent-cyan)',
            borderLeftColor: 'var(--color-accent-blue)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
            opacity: 0.3,
          }}
        />
      </div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}
      >
        {text}
      </motion.p>
    </div>
  )
}

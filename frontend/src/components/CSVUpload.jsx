import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function CSVUpload({ onResults }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef(null)
  const { addToast } = useToast()

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      addToast('Please upload a CSV file', 'error')
      return
    }

    setFileName(file.name)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      addToast(`Analyzed ${res.data.total} reviews from ${file.name}`, 'success')
      if (onResults) onResults(res.data)
    } catch (err) {
      addToast(err.response?.data?.detail || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => fileRef.current?.click()}
      style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: `2px dashed ${dragging ? 'var(--color-accent-blue)' : 'var(--color-border)'}`,
        background: dragging ? 'rgba(59, 130, 246, 0.05)' : 'rgba(15, 23, 55, 0.3)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {uploading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <FileText size={32} style={{ color: 'var(--color-accent-blue)' }} />
          </motion.div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Analyzing {fileName}...
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <Upload size={32} style={{ color: 'var(--color-text-muted)' }} />
          <div>
            <p style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem', margin: '0 0 0.25rem' }}>
              Drop a CSV file here or click to browse
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>
              CSV should have a "text", "review", or "content" column
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

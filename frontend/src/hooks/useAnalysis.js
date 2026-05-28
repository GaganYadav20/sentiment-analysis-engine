import { useState, useCallback } from 'react'
import api from '../services/api'

export function useAnalysis() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = useCallback(async (text) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/predict', { text })
      setResult(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Analysis failed. Is the backend running?'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { result, loading, error, analyze, reset }
}

export function useHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = useCallback(async (limit = 50) => {
    setLoading(true)
    try {
      const res = await api.get('/history', { params: { limit } })
      setHistory(res.data)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { history, loading, fetchHistory }
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/analytics')
      setAnalytics(res.data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      const msg =
        err.response?.data?.detail ||
        (err.response?.status === 401
          ? 'Authentication required — please log in.'
          : 'Could not load analytics. Is the backend running?')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { analytics, loading, error, fetchAnalytics }
}

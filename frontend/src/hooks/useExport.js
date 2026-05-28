import { useCallback } from 'react'

export function useExport() {
  const exportToCSV = useCallback((data, filename = 'sentiment_results.csv') => {
    if (!data || data.length === 0) return

    // Build CSV headers
    const headers = ['Text', 'Sentiment', 'Confidence', 'Positive', 'Neutral', 'Negative', 'Processing Time (ms)', 'Date']

    // Build CSV rows
    const rows = data.map(item => [
      `"${(item.text || '').replace(/"/g, '""')}"`,
      item.sentiment,
      item.confidence,
      item.scores?.positive || '',
      item.scores?.neutral || '',
      item.scores?.negative || '',
      item.processing_time_ms || '',
      item.created_at || '',
    ].join(','))

    const csv = [headers.join(','), ...rows].join('\n')

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  return { exportToCSV }
}

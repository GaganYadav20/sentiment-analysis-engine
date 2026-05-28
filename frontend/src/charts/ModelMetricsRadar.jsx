import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function ModelMetricsRadar({ metrics }) {
  if (!metrics) return null

  const data = [
    { metric: 'Accuracy', value: (metrics.accuracy * 100) },
    { metric: 'Precision', value: (metrics.precision * 100) },
    { metric: 'Recall', value: (metrics.recall * 100) },
    { metric: 'F1 Score', value: (metrics.f1_score * 100) },
  ]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(148, 163, 184, 0.1)" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
          tickCount={5}
        />
        <Radar
          name="Performance"
          dataKey="value"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.2}
          strokeWidth={2}
          animationDuration={1500}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

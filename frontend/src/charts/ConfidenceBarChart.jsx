import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function ConfidenceBarChart({ data }) {
  if (!data) return null

  const chartData = [
    { name: 'Positive', value: data.positive || 0 },
    { name: 'Neutral', value: data.neutral || 0 },
    { name: 'Negative', value: data.negative || 0 },
  ]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
        <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'rgba(15, 23, 55, 0.95)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1200}>
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} opacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

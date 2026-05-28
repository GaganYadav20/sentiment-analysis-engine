import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: 'rgba(15, 23, 55, 0.9)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.5rem 0.75rem',
      fontSize: '0.8rem',
    }}>
      <p style={{ color: d.payload.fill, margin: 0, fontWeight: 600 }}>{d.name}: {d.value}</p>
    </div>
  )
}

export default function SentimentPieChart({ data }) {
  if (!data) return null

  const chartData = [
    { name: 'Positive', value: data.positive || 0 },
    { name: 'Neutral', value: data.neutral || 0 },
    { name: 'Negative', value: data.negative || 0 },
  ].filter(d => d.value > 0)

  if (chartData.length === 0) {
    chartData.push({ name: 'No Data', value: 1 })
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
          animationBegin={200}
          animationDuration={1200}
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(15, 23, 55, 0.95)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.75rem',
      fontSize: '0.8rem',
    }}>
      <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: '0.15rem 0', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span>{p.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function TrendAreaChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        No trend data available yet. Start analyzing reviews!
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradNeu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
        <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
        <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
        <Area type="monotone" dataKey="positive" stroke="#10b981" fill="url(#gradPos)" strokeWidth={2} name="Positive" />
        <Area type="monotone" dataKey="neutral" stroke="#f59e0b" fill="url(#gradNeu)" strokeWidth={2} name="Neutral" />
        <Area type="monotone" dataKey="negative" stroke="#ef4444" fill="url(#gradNeg)" strokeWidth={2} name="Negative" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

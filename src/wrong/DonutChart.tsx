import { useState } from 'react'

export interface DonutDatum {
  label: string
  value: number
}

export interface DonutChartProps {
  title: string
  data: DonutDatum[]
}

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b']

const SIZE = 200
const RADIUS = 70
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const format = (n: number) => n.toLocaleString('en-US')

export function DonutChart({ title, data }: DonutChartProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  if (data.length === 0) {
    return (
      <section style={{ width: 312, padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>{title}</h2>
        <p data-testid="empty-state">No data</p>
      </section>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const current = data.find((d) => d.label === hovered)

  let offset = 0
  const arcs = data.map((d, i) => {
    const length = (d.value / total) * CIRCUMFERENCE
    const arc = { d, i, length, offset }
    offset += length
    return arc
  })

  return (
    <section style={{ width: 312, padding: 24, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>{title}</h2>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        role="img"
        aria-label={`${title}, total ${format(total)}`}
      >
        {arcs.map(({ d, i, length, offset }) => (
          <circle
            key={d.label}
            data-segment={d.label}
            data-active={hovered === d.label ? 'true' : undefined}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={28}
            strokeDasharray={`${length.toFixed(3)} ${(CIRCUMFERENCE - length).toFixed(3)}`}
            strokeDashoffset={(-offset).toFixed(3)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        ))}
        <text data-testid="centre-value" x={100} y={100} textAnchor="middle" fontSize={26} fontWeight={700}>
          {format(current ? current.value : total)}
        </text>
        <text data-testid="centre-caption" x={100} y={120} textAnchor="middle" fontSize={12}>
          {current ? current.label : 'Total'}
        </text>
      </svg>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {data.map((d, i) => (
          <li
            key={d.label}
            data-legend={d.label}
            onMouseEnter={() => setHovered(d.label)}
            onMouseLeave={() => setHovered(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}
          >
            <span
              style={{ width: 12, height: 12, borderRadius: 2, background: COLORS[i % COLORS.length] }}
            />
            <span style={{ flex: 1 }}>{d.label}</span>
            <span>{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

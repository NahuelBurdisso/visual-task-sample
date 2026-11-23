import { useState } from 'react'

export interface DonutDatum {
  label: string
  value: number
}

export interface DonutChartProps {
  title: string
  data: DonutDatum[]
}

const PALETTE = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b']

const CENTER = 100
const RADIUS = 70
const STROKE_WIDTH = 28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const format = (n: number) => n.toLocaleString('en-US')
const round3 = (n: number) => Math.round(n * 1000) / 1000

function compareLabels(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0
}

// Largest-remainder method: floor every share, then give the leftover points to
// the largest fractional remainders. Earlier entries win ties, so the result is
// deterministic. Zero-value entries have no remainder and never receive a point.
function roundPercentages(values: number[], total: number): number[] {
  const exact = values.map((v) => (v * 100) / total)
  // The epsilon absorbs float noise such as 29.999999999999996.
  const floors = exact.map((x) => Math.floor(x + 1e-9))
  let leftover = 100 - floors.reduce((a, b) => a + b, 0)
  const byRemainder = exact
    .map((x, i) => ({ i, remainder: Math.max(0, x - (floors[i] ?? 0)), eligible: (values[i] ?? 0) > 0 }))
    .filter((e) => e.eligible)
    .sort((a, b) => Math.round((b.remainder - a.remainder) * 1e9) || a.i - b.i)
  for (const { i } of byRemainder) {
    if (leftover <= 0) break
    floors[i] = (floors[i] ?? 0) + 1
    leftover -= 1
  }
  return floors
}

export function DonutChart({ title, data }: DonutChartProps) {
  const [active, setActive] = useState<string | null>(null)

  const items = [...data].sort((a, b) => b.value - a.value || compareLabels(a.label, b.label))
  const total = items.reduce((sum, d) => sum + d.value, 0)

  if (total <= 0) {
    return (
      <section style={cardStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <p data-testid="empty-state" style={{ color: '#64748b' }}>
          No data
        </p>
      </section>
    )
  }

  const percents = roundPercentages(
    items.map((d) => d.value),
    total,
  )
  const activeItem = items.find((d) => d.label === active)

  let consumed = 0
  const segments = items.flatMap((item, index) => {
    const arc = (item.value / total) * CIRCUMFERENCE
    const start = consumed
    consumed += arc
    if (item.value <= 0) return []
    return [{ item, index, arc, start }]
  })

  return (
    <section style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <svg
        viewBox="0 0 200 200"
        width={200}
        height={200}
        role="img"
        aria-label={`${title}, total ${format(total)}`}
      >
        {segments.map(({ item, index, arc, start }) => (
          <circle
            key={item.label}
            data-segment={item.label}
            data-active={active === item.label ? 'true' : undefined}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={PALETTE[index % PALETTE.length]}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${round3(arc)} ${round3(CIRCUMFERENCE - arc)}`}
            strokeDashoffset={round3(-start)}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            opacity={active === null || active === item.label ? 1 : 0.4}
          />
        ))}
        <text
          data-testid="centre-value"
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          fontSize={26}
          fontWeight={700}
          fill="#0f172a"
        >
          {format(activeItem ? activeItem.value : total)}
        </text>
        <text
          data-testid="centre-caption"
          x={CENTER}
          y={CENTER + 20}
          textAnchor="middle"
          fontSize={12}
          fill="#64748b"
        >
          {activeItem ? activeItem.label : 'Total'}
        </text>
      </svg>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={item.label}
            data-legend={item.label}
            tabIndex={0}
            onMouseEnter={() => setActive(item.label)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(item.label)}
            onBlur={() => setActive(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: PALETTE[index % PALETTE.length],
              }}
            />
            <span style={{ flex: 1 }}>{item.label}</span>
            <span>{percents[index]}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const cardStyle = {
  width: 312,
  padding: 24,
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  fontFamily: 'system-ui, sans-serif',
  fontSize: 14,
} as const

const titleStyle = { margin: '0 0 16px', fontSize: 18 } as const

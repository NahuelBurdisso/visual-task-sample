import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PALETTE, shuffled, sample, single, ties, withZeros, type Dataset } from './data'
import { readArcs, TOLERANCE } from './helpers'
import { DonutChart } from './impl'

const renderChart = (d: Dataset) => render(<DonutChart title={d.title} data={d.input} />).container

// Expected arcs in rendered order: non-zero categories only, with fractions taken
// from the input values and start positions accumulated in that order.
function expectedArcs(d: Dataset) {
  const total = d.input.reduce((s, x) => s + x.value, 0)
  let start = 0
  return d.legend
    .map(({ label }) => d.input.find((x) => x.label === label)!)
    .filter((x) => x.value > 0)
    .map((x) => {
      const arc = { label: x.label, fraction: x.value / total, start }
      start += arc.fraction
      return arc
    })
}

describe('[looks-right] sample dataset geometry', () => {
  it('draws one circle segment per category with r=70 centred at 100,100', () => {
    const arcs = readArcs(renderChart(sample))
    expect(arcs.map((a) => a.label)).toEqual(sample.legend.map((l) => l.label))
    for (const a of arcs) {
      expect([a.r, a.cx, a.cy]).toEqual([70, 100, 100])
    }
  })

  it('arc fractions match value / total', () => {
    const arcs = readArcs(renderChart(sample))
    for (const [i, want] of expectedArcs(sample).entries()) {
      expect(Math.abs((arcs[i]?.fraction ?? NaN) - want.fraction)).toBeLessThanOrEqual(TOLERANCE)
    }
  })

  it("starts at 12 o'clock and runs clockwise with no gaps", () => {
    const arcs = readArcs(renderChart(sample))
    for (const a of arcs) {
      expect(a.transform).toMatch(/^rotate\(\s*-90[\s,]+100[\s,]+100\s*\)$/)
    }
    for (const [i, want] of expectedArcs(sample).entries()) {
      expect(Math.abs((arcs[i]?.start ?? NaN) - want.start)).toBeLessThanOrEqual(TOLERANCE)
    }
  })

  it('colours segments from the palette in rendered order', () => {
    const arcs = readArcs(renderChart(sample))
    expect(arcs.map((a) => a.stroke?.toLowerCase())).toEqual(PALETTE.slice(0, sample.input.length))
  })
})

describe('segment order', () => {
  it('orders segments by value descending regardless of input order', () => {
    const arcs = readArcs(renderChart(shuffled))
    const want = expectedArcs(shuffled)
    expect(arcs.map((a) => a.label)).toEqual(want.map((w) => w.label))
    for (const [i, w] of want.entries()) {
      expect(Math.abs((arcs[i]?.fraction ?? NaN) - w.fraction)).toBeLessThanOrEqual(TOLERANCE)
      expect(Math.abs((arcs[i]?.start ?? NaN) - w.start)).toBeLessThanOrEqual(TOLERANCE)
    }
  })

  it('breaks ties by label ascending', () => {
    const arcs = readArcs(renderChart(ties))
    expect(arcs.map((a) => a.label)).toEqual(['Charlie', 'Alpha', 'Bravo'])
  })
})

describe('zero-value categories', () => {
  it('omits zero-value categories from the ring', () => {
    const arcs = readArcs(renderChart(withZeros))
    const want = expectedArcs(withZeros)
    expect(arcs.map((a) => a.label)).toEqual(['Active', 'Churned'])
    for (const [i, w] of want.entries()) {
      expect(Math.abs((arcs[i]?.fraction ?? NaN) - w.fraction)).toBeLessThanOrEqual(TOLERANCE)
      expect(Math.abs((arcs[i]?.start ?? NaN) - w.start)).toBeLessThanOrEqual(TOLERANCE)
    }
  })
})

describe('[looks-right] single non-zero category', () => {
  it('fills the whole ring', () => {
    const arcs = readArcs(renderChart(single))
    expect(arcs).toHaveLength(1)
    expect(Math.abs((arcs[0]?.fraction ?? NaN) - 1)).toBeLessThanOrEqual(TOLERANCE)
    expect(Math.abs(arcs[0]?.start ?? NaN)).toBeLessThanOrEqual(TOLERANCE)
  })
})

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { eightEqual, sample, thirds, ties, withZeros, type Dataset } from './data'
import { legendRows } from './helpers'
import { DonutChart } from './impl'

const rows = (d: Dataset) => legendRows(render(<DonutChart title={d.title} data={d.input} />).container)

describe('legend percentages', () => {
  it('[looks-right] sample dataset: 43, 26, 16, 10, 5 in descending order', () => {
    expect(rows(sample)).toEqual(sample.legend)
  })

  it.each([
    ['sample', sample],
    ['three equal thirds', thirds],
    ['eight equal shares', eightEqual],
    ['ties', ties],
    ['zero values', withZeros],
  ])('sums to 100: %s', (_name, d) => {
    const total = rows(d).reduce((s, r) => s + r.percent, 0)
    expect(total).toBe(100)
  })

  it.each([
    ['three equal thirds', thirds],
    ['eight equal shares', eightEqual],
    ['zero values', withZeros],
    ['ties', ties],
  ])('uses largest-remainder rounding, ties by label: %s', (_name, d) => {
    expect(rows(d)).toEqual(d.legend)
  })

  it('lists zero-value categories last, as 0%', () => {
    expect(rows(withZeros).slice(2)).toEqual([
      { label: 'Dormant', percent: 0 },
      { label: 'Idle', percent: 0 },
    ])
  })
})

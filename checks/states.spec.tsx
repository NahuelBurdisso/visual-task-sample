import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readArcs } from './helpers'
import { DonutChart } from './impl'

describe('empty state', () => {
  it('[looks-right] an empty array renders the empty state and no ring', () => {
    const { container } = render(<DonutChart title="Revenue by region" data={[]} />)
    expect(screen.getByTestId('empty-state').textContent).toMatch(/no data/i)
    expect(readArcs(container)).toHaveLength(0)
    expect(container.querySelector('[data-legend]')).toBeNull()
  })

  it('all-zero data renders the empty state and no ring', () => {
    const data = [
      { label: 'A', value: 0 },
      { label: 'B', value: 0 },
    ]
    const { container } = render(<DonutChart title="Revenue by region" data={data} />)
    expect(screen.getByTestId('empty-state').textContent).toMatch(/no data/i)
    expect(readArcs(container)).toHaveLength(0)
    expect(container.textContent).not.toMatch(/NaN/)
  })
})

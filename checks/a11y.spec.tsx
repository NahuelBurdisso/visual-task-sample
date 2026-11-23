import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { sample, withZeros } from './data'
import { legendItems } from './helpers'
import { DonutChart } from './impl'

describe('accessibility', () => {
  it('[looks-right] the chart has role img named with the title and the total', () => {
    render(<DonutChart title={sample.title} data={sample.input} />)
    const img = screen.getByRole('img', {
      name: (name) => name.includes(sample.title) && name.includes(sample.total),
    })
    expect(img.tagName.toLowerCase()).toBe('svg')
  })

  it('[looks-right] the title is a heading', () => {
    render(<DonutChart title={sample.title} data={sample.input} />)
    expect(screen.getByRole('heading', { name: sample.title })).toBeTruthy()
  })

  it.each([
    ['sample', sample],
    ['zero values', withZeros],
  ])('every legend item is reachable with the Tab key, in legend order: %s', async (_name, d) => {
    const user = userEvent.setup()
    const { container } = render(<DonutChart title={d.title} data={d.input} />)
    const items = legendItems(container)
    expect(items).toHaveLength(d.legend.length)
    for (const item of items) {
      await user.tab()
      expect(document.activeElement).toBe(item)
    }
  })
})

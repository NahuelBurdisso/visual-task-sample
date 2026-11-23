import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { sample, withZeros } from './data'
import { centre, isActive, legendItem, readArcs, segment } from './helpers'
import { DonutChart } from './impl'

const setup = (d = sample) => ({
  user: userEvent.setup(),
  container: render(<DonutChart title={d.title} data={d.input} />).container,
})

const activeLabels = (container: HTMLElement) =>
  readArcs(container)
    .map((a) => a.label)
    .filter((label) => isActive(segment(container, label)))

describe('interaction', () => {
  it("[looks-right] hovering a legend item activates its segment and shows its value", async () => {
    const { user, container } = setup()
    await user.hover(legendItem(container, 'Europe'))
    expect(activeLabels(container)).toEqual(['Europe'])
    expect(centre()).toEqual({ value: '310', caption: 'Europe' })
  })

  it('[looks-right] leaving a legend item restores the total', async () => {
    const { user, container } = setup()
    const item = legendItem(container, 'Europe')
    await user.hover(item)
    await user.unhover(item)
    expect(activeLabels(container)).toEqual([])
    expect(centre()).toEqual({ value: '1,200', caption: 'Total' })
  })

  it('focusing a legend item with the keyboard activates its segment and shows its value', async () => {
    const { user, container } = setup()
    await user.tab()
    await user.tab()
    expect(document.activeElement).toBe(legendItem(container, 'Europe'))
    expect(activeLabels(container)).toEqual(['Europe'])
    expect(centre()).toEqual({ value: '310', caption: 'Europe' })
  })

  it('blurring a legend item restores the total', async () => {
    const { user, container } = setup()
    await user.tab()
    expect(activeLabels(container)).toEqual(['North America'])
    act(() => (document.activeElement as HTMLElement).blur())
    expect(activeLabels(container)).toEqual([])
    expect(centre()).toEqual({ value: '1,200', caption: 'Total' })
  })

  it('hovering a zero-value item shows 0 and activates no segment', async () => {
    const { user, container } = setup(withZeros)
    await user.hover(legendItem(container, 'Idle'))
    expect(activeLabels(container)).toEqual([])
    expect(centre()).toEqual({ value: '0', caption: 'Idle' })
  })
})

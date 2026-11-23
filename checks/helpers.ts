import { screen } from '@testing-library/react'

export interface Arc {
  label: string
  r: number
  cx: number
  cy: number
  stroke: string | null
  transform: string | null
  // Share of the circumference covered by the dash, 0..1.
  fraction: number
  // Where the dash begins, as a share of the circumference, 0..1.
  start: number
}

const numbers = (s: string | null) => (s?.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number)

export function readArcs(container: HTMLElement): Arc[] {
  return [...container.querySelectorAll<SVGCircleElement>('circle[data-segment]')].map((el) => {
    const r = Number(el.getAttribute('r'))
    const circumference = 2 * Math.PI * r
    const [dash = NaN] = numbers(el.getAttribute('stroke-dasharray'))
    const offset = numbers(el.getAttribute('stroke-dashoffset'))[0] ?? 0
    const start = (((-offset / circumference) % 1) + 1) % 1
    return {
      label: el.getAttribute('data-segment') ?? '',
      r,
      cx: Number(el.getAttribute('cx')),
      cy: Number(el.getAttribute('cy')),
      stroke: el.getAttribute('stroke'),
      transform: el.getAttribute('transform'),
      fraction: dash / circumference,
      start,
    }
  })
}

export const segment = (container: HTMLElement, label: string) =>
  container.querySelector<SVGCircleElement>(`circle[data-segment="${label}"]`)

export const legendItems = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>('[data-legend]')]

export const legendItem = (container: HTMLElement, label: string) =>
  container.querySelector<HTMLElement>(`[data-legend="${label}"]`)!

export function legendRows(container: HTMLElement) {
  return legendItems(container).map((el) => ({
    label: el.getAttribute('data-legend') ?? '',
    percent: Number(/(\d+)%/.exec(el.textContent ?? '')?.[1] ?? NaN),
  }))
}

export const centre = () => ({
  value: screen.getByTestId('centre-value').textContent,
  caption: screen.getByTestId('centre-caption').textContent,
})

export const isActive = (el: Element | null) => el?.getAttribute('data-active') === 'true'

// Arc length and start offset may differ from the exact value by this share of the circumference.
export const TOLERANCE = 0.002

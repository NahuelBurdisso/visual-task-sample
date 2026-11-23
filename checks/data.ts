export interface Dataset {
  title: string
  input: { label: string; value: number }[]
  total: string
  // Expected legend rows in order. Written by hand, not derived from any implementation.
  legend: { label: string; percent: number }[]
}

export const sample: Dataset = {
  title: 'Revenue by region',
  input: [
    { label: 'North America', value: 520 },
    { label: 'Europe', value: 310 },
    { label: 'Asia Pacific', value: 190 },
    { label: 'Latin America', value: 120 },
    { label: 'Other', value: 60 },
  ],
  total: '1,200',
  legend: [
    { label: 'North America', percent: 43 },
    { label: 'Europe', percent: 26 },
    { label: 'Asia Pacific', percent: 16 },
    { label: 'Latin America', percent: 10 },
    { label: 'Other', percent: 5 },
  ],
}

export const shuffled: Dataset = {
  ...sample,
  input: [
    { label: 'Other', value: 60 },
    { label: 'Europe', value: 310 },
    { label: 'North America', value: 520 },
    { label: 'Latin America', value: 120 },
    { label: 'Asia Pacific', value: 190 },
  ],
}

export const ties: Dataset = {
  title: 'Tie breaking',
  input: [
    { label: 'Bravo', value: 5 },
    { label: 'Alpha', value: 5 },
    { label: 'Charlie', value: 10 },
  ],
  total: '20',
  legend: [
    { label: 'Charlie', percent: 50 },
    { label: 'Alpha', percent: 25 },
    { label: 'Bravo', percent: 25 },
  ],
}

// Independent rounding gives 33 + 33 + 33 = 99.
export const thirds: Dataset = {
  title: 'Three equal thirds',
  input: [
    { label: 'Gamma', value: 1 },
    { label: 'Alpha', value: 1 },
    { label: 'Beta', value: 1 },
  ],
  total: '3',
  legend: [
    { label: 'Alpha', percent: 34 },
    { label: 'Beta', percent: 33 },
    { label: 'Gamma', percent: 33 },
  ],
}

// Independent rounding gives 8 x 13 = 104.
export const eightEqual: Dataset = {
  title: 'Eight equal shares',
  input: 'HGFEDCBA'.split('').map((label) => ({ label, value: 10 })),
  total: '80',
  legend: [
    { label: 'A', percent: 13 },
    { label: 'B', percent: 13 },
    { label: 'C', percent: 13 },
    { label: 'D', percent: 13 },
    { label: 'E', percent: 12 },
    { label: 'F', percent: 12 },
    { label: 'G', percent: 12 },
    { label: 'H', percent: 12 },
  ],
}

export const withZeros: Dataset = {
  title: 'With zero values',
  input: [
    { label: 'Idle', value: 0 },
    { label: 'Active', value: 60 },
    { label: 'Dormant', value: 0 },
    { label: 'Churned', value: 40 },
  ],
  total: '100',
  legend: [
    { label: 'Active', percent: 60 },
    { label: 'Churned', percent: 40 },
    { label: 'Dormant', percent: 0 },
    { label: 'Idle', percent: 0 },
  ],
}

export const single: Dataset = {
  title: 'Single category',
  input: [{ label: 'Solo', value: 42 }],
  total: '42',
  legend: [{ label: 'Solo', percent: 100 }],
}

export const PALETTE = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b']

type Impl = 'reference' | 'wrong' | 'starter'

const loaders = {
  reference: () => import('../src/reference/DonutChart'),
  wrong: () => import('../src/wrong/DonutChart'),
  starter: () => import('../src/starter/DonutChart'),
} satisfies Record<Impl, () => Promise<{ DonutChart: unknown }>>

const name = (process.env.IMPL ?? 'reference') as Impl
if (!(name in loaders)) {
  throw new Error(`IMPL must be one of ${Object.keys(loaders).join(', ')}; got "${name}"`)
}

// Typed from the reference so the specs see one props shape for every implementation.
export const DonutChart = (await loaders[name]()).DonutChart as typeof import('../src/reference/DonutChart').DonutChart
export const implName = name

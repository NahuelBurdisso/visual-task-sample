import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DonutChart } from './reference/DonutChart'
import { SAMPLE_DATA, SAMPLE_TITLE } from './sample-data'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <DonutChart title={SAMPLE_TITLE} data={SAMPLE_DATA} />
    </div>
  </StrictMode>,
)

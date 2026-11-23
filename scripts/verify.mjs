// Runs the checks against the reference (must pass) and the wrong implementation
// (must fail where it is defective, and must still pass the checks tagged [looks-right]).
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const vitest = join(root, 'node_modules', 'vitest', 'vitest.mjs')

// Each seeded defect in src/wrong and a check that must catch it.
const DEFECTS = [
  ['percentages rounded independently', 'sums to 100: three equal thirds'],
  ['zero-value segments drawn', 'omits zero-value categories from the ring'],
  ['no keyboard support (hover only)', 'every legend item is reachable with the Tab key'],
  ['segments left in input order', 'orders segments by value descending'],
  ['all-zero data not treated as empty', 'all-zero data renders the empty state'],
]

function run(impl) {
  const dir = mkdtempSync(join(tmpdir(), 'verify-'))
  const outputFile = join(dir, 'result.json')
  const proc = spawnSync(
    process.execPath,
    [vitest, 'run', '--reporter=json', `--outputFile=${outputFile}`],
    { cwd: root, env: { ...process.env, IMPL: impl }, encoding: 'utf8' },
  )
  let report
  try {
    report = JSON.parse(readFileSync(outputFile, 'utf8'))
  } catch {
    console.error(`Could not read the vitest report for IMPL=${impl}.\n${proc.stderr}`)
    process.exit(2)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
  const tests = report.testResults.flatMap((file) => file.assertionResults)
  return {
    passed: tests.filter((t) => t.status === 'passed'),
    failed: tests.filter((t) => t.status === 'failed'),
    total: tests.length,
  }
}

const problems = []

const reference = run('reference')
console.log(`reference: ${reference.passed.length}/${reference.total} checks passed`)
if (reference.total === 0) problems.push('reference ran no checks')
for (const t of reference.failed) problems.push(`reference failed: ${t.fullName}`)

const wrong = run('wrong')
console.log(`wrong:     ${wrong.failed.length}/${wrong.total} checks failed (expected)`)
if (wrong.failed.length === 0) problems.push('wrong passed every check')

console.log('\nChecks the wrong implementation fails:')
for (const t of wrong.failed) console.log(`  - ${t.fullName}`)

const looksRight = [...wrong.passed, ...wrong.failed].filter((t) => t.fullName.includes('[looks-right]'))
console.log(`\nLooks-right checks the wrong implementation passes: ${looksRight.filter((t) => t.status === 'passed').length}/${looksRight.length}`)
if (looksRight.length === 0) problems.push('no [looks-right] checks found')
for (const t of looksRight.filter((t) => t.status === 'failed')) {
  problems.push(`wrong should look right but failed: ${t.fullName}`)
}

console.log('\nSeeded defects:')
for (const [defect, check] of DEFECTS) {
  const caught = wrong.failed.some((t) => t.fullName.includes(check))
  console.log(`  ${caught ? 'caught' : 'MISSED'}  ${defect}  <-  ${check}`)
  if (!caught) problems.push(`defect not caught: ${defect}`)
}

if (problems.length > 0) {
  console.error('\nverify failed:')
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log('\nverify ok: reference passes, wrong fails, wrong still looks right on the sample.')

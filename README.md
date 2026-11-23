# visual-task-sample

[![CI](https://github.com/NahuelBurdisso/visual-task-sample/actions/workflows/ci.yml/badge.svg)](https://github.com/NahuelBurdisso/visual-task-sample/actions/workflows/ci.yml)

A worked example of turning a visual mockup into a coding task with objective, automated
success criteria. It contains the task statement, a reference solution, the checks, and a
second implementation that looks right on the mockup but is wrong, to show the checks
reject it.

The modelled task: implement a `DonutChart` React component (SVG donut, title, centre
total, legend with per-category percentages) from a mockup.

## What this demonstrates

1. A mockup shows one frame of one dataset. `task/TASK.md` closes every gap it leaves:
   segment order, start angle, percentage rounding, zero values, empty data, a single
   category, accessibility, and interaction. It also lists what is not graded.
2. The success criteria are checks, not opinions. Geometry is verified from the rendered
   SVG: the contract requires `<circle>` segments with `stroke-dasharray` and
   `stroke-dashoffset` on a stated radius, so a spec can compute each arc's fraction and
   start angle and compare them to the data within a stated tolerance. A self-reported
   attribute such as `data-fraction` would let a solver assert the answer instead of
   drawing it, so it is not accepted as evidence.
3. The checks are shown to discriminate. `src/wrong` renders the mockup's sample dataset
   correctly and still fails the checks, and `npm run verify` enforces that.

## Layout

```
task/TASK.md              the task statement a solver receives
task/mockup.svg           the static mockup embedded in TASK.md
task/RUBRIC.md            requirement -> check mapping, and what is excluded and why
src/starter/              the stub a solver starts from
src/reference/            the correct implementation
src/wrong/                a plausible implementation with real defects
src/sample-data.ts        the mockup's dataset, used by the dev page
checks/                   Vitest specs; IMPL selects the implementation under test
scripts/verify.mjs        runs reference (must pass) and wrong (must fail)
```

There is no shared `src/lib`. The checks carry their own hand-written expected values
(`checks/data.ts`), so no helper can leak the right answer to the wrong implementation.

## Run

Node 22. A POSIX shell is assumed for the `IMPL=` prefix in the npm scripts.

```
npm ci
npm run dev           # reference with the sample data
npm run typecheck
npm run check         # checks against IMPL (default: reference)
npm run check:wrong   # checks against the wrong implementation (expected to fail)
npm run verify        # reference must pass, wrong must fail
IMPL=starter npm run check   # the unmodified stub fails every check
```

`npm run verify` also requires that the wrong implementation passes every check tagged
`[looks-right]` (the properties visible in the mockup), and that each seeded defect is
caught by its named check.

## Why the wrong implementation fails

`src/wrong/DonutChart.tsx` matches the mockup on the sample dataset (geometry, legend
percentages, accessible name, hover, restore on leave). It has these defects:

| Defect | Check that catches it |
| --- | --- |
| Percentages rounded independently with `Math.round`; three equal thirds give 33, 33, 33 (sum 99) and eight equal shares give 13 each (sum 104) | `legend percentages > sums to 100: three equal thirds` and `eight equal shares`; `uses largest-remainder rounding, ties by label` |
| Zero-value categories are drawn as zero-length circles | `zero-value categories > omits zero-value categories from the ring` |
| Hover only: legend items are not focusable and have no focus handlers | `accessibility > every legend item is reachable with the Tab key`; `interaction > focusing a legend item with the keyboard ...`; `blurring a legend item ...` |
| Segments stay in input order, not value descending with label tie-break | `segment order > orders segments by value descending regardless of input order`; `breaks ties by label ascending` |
| All-zero data is not treated as empty and renders `NaN` | `empty state > all-zero data renders the empty state and no ring` |

The sample dataset is already sorted, has no zeros, and rounds the same either way, which
is why a solver working only from the picture would not notice any of these.

See `task/RUBRIC.md` for the full requirement-to-check table.

# Rubric

Each requirement in `TASK.md` maps to checks in `checks/`. A check name below is the
`describe` and `it` title in the spec file. Checks tagged `[looks-right]` are the ones a
solver would get right by matching the mockup alone; the wrong implementation is
required to pass all of them.

| Requirement (TASK.md) | Check | Spec file |
| --- | --- | --- |
| One circle per category, `r=70`, `cx=cy=100` | draws one circle segment per category with r=70 centred at 100,100 `[looks-right]` | `geometry.spec.tsx` |
| Arc length equals value / total (tolerance 0.002) | arc fractions match value / total `[looks-right]` | `geometry.spec.tsx` |
| Start at 12 o'clock, clockwise, contiguous | starts at 12 o'clock and runs clockwise with no gaps `[looks-right]` | `geometry.spec.tsx` |
| Palette order | colours segments from the palette in rendered order `[looks-right]` | `geometry.spec.tsx` |
| Sort by value descending, independent of input order | orders segments by value descending regardless of input order | `geometry.spec.tsx` |
| Ties broken by label ascending | breaks ties by label ascending | `geometry.spec.tsx` |
| Zero-value categories omitted from the ring | omits zero-value categories from the ring | `geometry.spec.tsx` |
| Single non-zero category fills the ring | fills the whole ring `[looks-right]` | `geometry.spec.tsx` |
| Legend percentages on the sample | sample dataset: 43, 26, 16, 10, 5 in descending order `[looks-right]` | `legend.spec.tsx` |
| Percentages sum to 100 | sums to 100: sample, three equal thirds, eight equal shares, ties, zero values | `legend.spec.tsx` |
| Largest-remainder rounding, ties by rendered order | uses largest-remainder rounding, ties by label (four datasets) | `legend.spec.tsx` |
| Zero-value categories listed last as 0% | lists zero-value categories last, as 0% | `legend.spec.tsx` |
| Empty array: empty state, no ring, no legend | an empty array renders the empty state and no ring `[looks-right]` | `states.spec.tsx` |
| All-zero data: empty state, no `NaN` | all-zero data renders the empty state and no ring | `states.spec.tsx` |
| `role="img"` named with title and total | the chart has role img named with the title and the total `[looks-right]` | `a11y.spec.tsx` |
| Title is a heading | the title is a heading `[looks-right]` | `a11y.spec.tsx` |
| Legend items reachable with Tab, in order | every legend item is reachable with the Tab key, in legend order (two datasets) | `a11y.spec.tsx` |
| Hover activates the segment and shows its value | hovering a legend item activates its segment and shows its value `[looks-right]` | `interaction.spec.tsx` |
| Leaving restores the total (mouse) | leaving a legend item restores the total `[looks-right]` | `interaction.spec.tsx` |
| Focus activates the segment and shows its value | focusing a legend item with the keyboard activates its segment and shows its value | `interaction.spec.tsx` |
| Blur restores the total | blurring a legend item restores the total | `interaction.spec.tsx` |
| Zero-value item active: centre shows 0, no segment marked | hovering a zero-value item shows 0 and activates no segment | `interaction.spec.tsx` |

## Ungradable or deliberately excluded

| Item | Reason |
| --- | --- |
| Fonts, sizes, spacing, card dimensions | jsdom does no layout. A visual-diff check would be flaky across machines and would reward pixel matching over correct behaviour. |
| Exact colours beyond palette order | The palette is given. Only its order is observable and meaningful. A solver who picks a different shade of the same hue has not failed the task. |
| `stroke-width`, hover emphasis styling | The mockup does not show an active state. Pinning a visual treatment would be invention, so only `data-active` and the centre text are specified. |
| Animation and transitions | Timing-dependent, and jsdom does not run CSS animations. |
| Whether the ring looks right on screen | Not observable in jsdom. The contract moves the question into attributes (`r`, dash length, offset, rotation) so geometry is checked without rendering pixels. If the attributes are right, a browser draws the right ring. |
| Hover and focus from a real pointer or screen reader | `user-event` dispatches the same events, but it does not model assistive technology. The accessible-name check covers the part jsdom can compute. |
| Code quality, component structure | Subjective. The task grades behaviour. |
| Invalid inputs (negative, `NaN`, duplicate labels) | Left undefined in `TASK.md`, so tests would pin behaviour the task never asked for. |
| Legend swatch colour | Stated in `TASK.md` for completeness but not checked. The segment `stroke` is checked instead, and a swatch mismatch would be a visual defect the checks cannot observe reliably. |

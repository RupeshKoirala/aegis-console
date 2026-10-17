# M06.04 · `hostDirectives`: composition over inheritance  ⏱ 30 min

You already have two small, reusable directives:
- `[aegisTooltip]` sets a tooltip (`title` + `aria-label`)
- `[aegisFocusable]` makes any element keyboard-focusable and emits `activated` on Enter or Space

The new **indicator chip** should have both behaviours **built in**, without the consumer writing `aegisTooltip aegisFocusable` every time, and without inheritance:
```ts
@Component({
  selector: 'aegis-indicator-chip',
  hostDirectives: [
    { directive: Tooltip, inputs: ['aegisTooltip: tip'] },        // expose the input under a nicer name
    { directive: Focusable, outputs: ['activated'] },             // re-expose the output
  ],
})
```
Inputs and outputs of host directives are **private** unless you list them. That's deliberate, so the component controls its public API.

## Your tasks: `indicator-chip.ts` TODO 1, `page.ts` TODO 2

## Senior notes
- Gen 1 code reused behaviour with base classes (`class Chip extends TooltipBase`). Inheritance couples lifecycles and DI, and you can only have one parent. `hostDirectives` (v15+) composes many small behaviours.
- Host directives can only be standalone directives. They're instantiated *before* the host component, so the component can `inject()` them.

# M26.03 · Accessibility: keyboard, screen readers, focus  ⏱ 60 min

Accessibility is a **requirement** for many enterprise and public-sector customers (WCAG 2.2 AA, Section 508, EN 301 549). It's also just good engineering: the keyboard-only path is the fastest path for power users.

The CDK `a11y` package solves the hard parts:
| Need | Tool |
|---|---|
| ↑/↓/Home/End over a list, one tab stop | `ActiveDescendantKeyManager` (focus stays on the list, `aria-activedescendant` points at the option) or `FocusKeyManager` (roving tabindex) |
| announce a change that's only visual | `LiveAnnouncer.announce('…', 'polite')` (an ARIA live region) |
| keep Tab inside a modal | `cdkTrapFocus` (+ `cdkTrapFocusAutoCapture` to focus the first element and restore later) |
| the right semantics | `role="listbox"/"option"`, `role="dialog" aria-modal aria-labelledby` |

## Your tasks: `alert-queue.ts` TODO 1–4 (TODO 5 is a worked example to study)
Then use `/m26/03` with the keyboard only, and with a screen reader if you can.

## Senior notes
- **Use native elements first.** `<button>`, `<a href>` and `<select>` come accessible for free. Custom widgets (listbox, combobox, tree) need the full ARIA pattern from the WAI-ARIA Authoring Practices.
- Every interactive thing must be reachable by keyboard and have a **visible focus** style (`:focus-visible`, never `outline: none` without a replacement).
- Automate what you can: axe-core in unit tests or e2e (`@axe-core/playwright`) catches roughly a third of issues, such as contrast, labels and roles. The rest needs manual testing.
- Angular Material / CDK components implement these patterns already. Reach for `@angular/cdk/listbox`, `menu` and `dialog` before hand-rolling.
- Gen 1/2/3: the CDK a11y primitives date from v5. Gen 3 adds signal-friendly APIs (`viewChildren` signals work directly with key managers) and Angular Aria (new headless accessible components).

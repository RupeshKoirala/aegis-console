# M07.01 · The built-in catalog  ⏱ 35 min

An **alert detail card** that formats raw API values for humans. Every line uses a different built-in pipe.

```html
{{ value | pipe }}   {{ value | pipe: arg1 : arg2 }}   {{ value | pipeA | pipeB }}
```
| Pipe | Example | Output |
|---|---|---|
| `date` | `at \| date: 'medium' : 'UTC'` | `Oct 15, 2026, 11:40:00 AM` |
| `date` (custom) | `at \| date: 'yyyy-MM-dd HH:mm' : 'UTC'` | `2026-10-15 11:40` |
| `number` | `1284.5 \| number: '1.0-0'` | `1,285` (minInt.minFrac-maxFrac) |
| `percent` | `0.869 \| percent: '1.1-1'` | `86.9%` |
| `currency` | `4200 \| currency: 'USD' : 'symbol' : '1.0-0'` | `$4,200` |
| `slice` | `hash \| slice: 0 : 12` | first 12 chars |
| `uppercase` / `lowercase` / `titlecase` | `'acme schools' \| titlecase` | `Acme Schools` |
| `keyvalue` | `@for (kv of obj \| keyvalue; …)` | iterate an object's entries (sorted by key) |
| `json` | `obj \| json` | debug output |
| `i18nPlural` | `n \| i18nPlural: { '=0': 'no hits', '=1': '1 hit', other: '# hits' }` | `3 hits` |
| `i18nSelect` | `status \| i18nSelect: { NEW: 'New', other: 'Closed' }` | `New` |
| `async` | `stream$ \| async` | subscribes + unsubscribes for you (M11) |

## Your tasks: `page.ts` TODO 1, `page.html` TODO 2–8

## Senior notes
- Always pass a **timezone** to `date` for security data, or every analyst sees a different "when". SOC tooling standardises on UTC.
- `keyvalue` sorts by key by default. Pass a compare function to keep insertion order: `| keyvalue: noSort`.
- Pipes are **pure** by default, so they're cached until their input reference changes. That's why `{{ x | myPipe }}` beats `{{ format(x) }}`, which runs on every check.

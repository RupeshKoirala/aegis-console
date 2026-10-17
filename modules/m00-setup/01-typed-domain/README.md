# M00.01 · Typed domain helpers  ⏱ 30 min

The console handles untrusted strings all day: a SOC analyst pastes `203.0.113.7`, a feed sends `198.51.100.0/24`, someone types `EVIL.example `. Before any Angular, you need TypeScript to make those values safe and well-typed.

## Concepts
```ts
type IndicatorType = 'IP' | 'CIDR' | 'DOMAIN';   // a union of literal types: only these 3 strings compile

function classify(value: string): IndicatorType | null { … }   // "| null": the caller MUST handle "not valid"

const t = classify(input);
if (t === null) return;            // narrowing: after this line TS knows t is IndicatorType
t.toLowerCase();                   // ✅ allowed now

function groupBy<T, K extends PropertyKey>(items: readonly T[], key: (item: T) => K): Record<K, T[]>
//              ↑ generics: works for indicators, lists, alerts… and keeps the types
```
- `readonly T[]` promises you won't mutate the caller's array (the compiler enforces it).
- Prefer **pure functions** (same input → same output, no side effects). They are trivial to test, and Angular's `computed()` and pipes love them.

## Your tasks: `indicator-utils.ts`
1. `classify(value)`: trim and lower-case, then return `'IP'` for a valid IPv4 address (each octet 0–255), `'CIDR'` for `IPv4/0..32`, `'DOMAIN'` for something like `evil.example`, otherwise `null`.
2. `riskLevel(score)`: `null` → `'INFO'`; ≥ 90 `'CRITICAL'`; ≥ 70 `'HIGH'`; ≥ 40 `'MEDIUM'`; otherwise `'LOW'`.
3. `isExpired(indicator, now)`: `true` only if `expiresAt` is set **and** in the past.
4. `groupBy(items, key)`: the generic helper above. Must not mutate `items`.
5. `label(indicator)`: `"203.0.113.66 (IP) · Botnets 97"` for threat indicators, `"evil.example (DOMAIN)"` otherwise. Use a template literal.

## Check
`npm run ex -- m00/01`, then open **M00 → 01** in the app and type values into the playground.

## Senior notes
- Validate at the **boundary** (forms, API responses), then pass precise types inward. Most code should never see a raw `string` where an `IndicatorType` belongs.
- Regex is fine for IPv4. For IPv6 or real-world parsing, use a tested library; hand-rolled IP parsing is a classic source of security bugs (think `010.0.0.1` octal, `1.1`, `0x7f.1`).
- Interview question: *"`any` vs `unknown`?"* With `unknown` you must narrow before use; with `any` you've switched type-checking off.

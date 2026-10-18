# M18.02 · Locale formatting & time zones  ⏱ 40 min

Translation is half of it. The other half is **formatting**: `12,345` vs `12 345` vs `12.345`, `10/15/2026` vs `15/10/2026`, and above all **time zones**. An incident report that says "11:40" without a zone is useless to an SOC with analysts in Kathmandu and New York.

```ts
registerLocaleData(localeFr);                                   // once: Angular's pipes/functions need the data
formatNumber(12345, 'fr', '1.0-0')                              // "12 345"
formatDate(iso, 'yyyy-MM-dd HH:mm', 'fr', '+0545')              // in a given UTC offset
new Intl.RelativeTimeFormat('de', { numeric: 'auto' }).format(-10, 'second')   // "vor 10 Sekunden"
new Intl.Collator('fr', { numeric: true, sensitivity: 'base' }).compare          // human sorting
```
In templates, the same: `{{ a.at | date: 'medium' : '+0545' : 'fr' }}` and `{{ n | number }}` (which uses `LOCALE_ID`).

## Your tasks: `locale-format.ts` TODO 1–5

## Senior notes
- **Store UTC, display local.** The API sends ISO instants in UTC (`…Z`). Convert only at the edge (the template), with the **user's** chosen zone, and show the zone.
- A fixed offset like `+0200` ignores daylight saving. For named zones (`Europe/Paris`), use `Intl.DateTimeFormat(locale, { timeZone: 'Europe/Paris' })`, which knows the DST rules.
- `LOCALE_ID` is app-wide (set at bootstrap or per `--localize` build). Pass an explicit locale, as here, when one page must show several.
- `Array.prototype.sort()` without a comparator sorts by UTF-16 code units: "Z" before "a", "É" after "z". Always sort user-visible text with a collator.
- Gen 1/2/3: `DatePipe`/`registerLocaleData` haven't changed much. Modern code leans on `Intl.*` directly for anything the pipes don't cover (relative time, lists, display names).

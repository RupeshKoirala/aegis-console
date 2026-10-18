# M18 · i18n

📖 **Read first (Study Hub):** `angular-manual/m10` pipes · `angular-manual/m4` template syntax

| # | Exercise | You practise |
|---|---|---|
| 01 | Messages, ICU & `$localize` | `i18n` / `i18n-attr`, custom IDs, ICU plural/select, `$localize` in TS, runtime `loadTranslations`, extract + `--localize` lab |
| 02 | Locale formatting & time zones | `registerLocaleData`, `formatDate`/`formatNumber` with explicit locale + zone, `Intl.RelativeTimeFormat`, `Intl.Collator` |

### Generations
- **Gen 1:** template-only i18n, XLIFF, one AOT build per language. Locale data shipped with `@angular/common/locales`.
- **Gen 2 (v9+):** `@angular/localize`, `$localize` in code, runtime translation loading, `--localize` builds.
- **Gen 3 (v17–v22):** application builder `--localize`, JSON/ARB formats, and `Intl`-first formatting everywhere.

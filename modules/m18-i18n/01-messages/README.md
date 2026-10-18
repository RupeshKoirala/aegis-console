# M18.01 · Messages, ICU & `$localize`  ⏱ 60 min

Aegis sells to schools in Québec and hospitals in France. Every string an analyst reads must be translatable, **including plurals**, which differ per language.

```html
<h2 i18n="Heading of the alert summary card@@alerts.title">Open alerts</h2>       <!-- description@@id -->
<input i18n-placeholder="@@alerts.search" placeholder="Search alerts" />              <!-- attributes: i18n-<attr> -->
<p i18n="@@alerts.count">{open(), plural, =0 {No open alerts} =1 {One open alert} other {{{open()}} open alerts}}</p>
<p i18n="@@alerts.worst">Highest severity: {worst(), select, CRITICAL {critical} other {normal}}</p>
```
```ts
$localize`:@@alert.status.new:New`                      // in TypeScript
$localize`:@@alert.assigned:Assigned to ${name}:name:`  // with a named placeholder
```
**Custom IDs** (`@@…`) keep translations attached when the English wording changes. Without them, the ID is a hash of the text, and every typo fix orphans a translation.

## Your tasks: `alert-summary.ts` TODO 1–2
The test loads `fr.translations.ts` at runtime, so you'll see French when you get it right.

## Lab: the real build-time workflow (15 min)
```bash
npx ng extract-i18n --format json --output-path src/locale        # → src/locale/messages.json (all IDs + English)
```
1. Copy it to `messages.fr.json`, translate a few strings (or paste `FR` from this exercise).
2. In `angular.json` → project: `"i18n": { "sourceLocale": "en-US", "locales": { "fr": "src/locale/messages.fr.json" } }`.
3. `npx ng build --localize` → `dist/…/browser/en-US/` and `…/fr/`: **one build per language**, translations inlined at build time, no runtime cost.
4. Revert `angular.json` when done (the course app stays single-locale).

## Senior notes
- Angular's built-in i18n is **compile-time**: switching language means loading the other build (`/fr/`). If the product needs a runtime language switcher, teams use a runtime library (Transloco, ngx-translate), which costs some bundle and runtime but switches instantly.
- Nested ICUs get **hashed IDs** (see `fr.translations.ts`). Prefer one ICU per message, and lint for missing translations in CI (`--localize` fails on missing ones if you set `i18nMissingTranslation: "error"`).
- Never concatenate translated fragments (`'Assigned to' + name`): word order differs per language. Use placeholders.
- **Gen 1 (v2–v8):** i18n only in templates (XLIFF + AOT per locale), with no TS strings. **Gen 2 (v9+):** `@angular/localize` + `$localize` everywhere, runtime `loadTranslations`. **Gen 3:** the same, plus the application builder's `--localize` and better tooling (JSON/ARB formats).

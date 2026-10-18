# M26 · Senior frontend

📖 **Read first (Study Hub):** `cyber/l13` defending web apps · `foundations/l19` browser security & state · `foundations/l32` observability & production · `angular-manual/m18` the whole picture

What separates "it works" from "it's production-grade at a security company":

| # | Exercise | You practise |
|---|---|---|
| 01 | XSS & sanitization | escaping, URL allow-lists, escape-then-format, removing `bypassSecurityTrust*`, CSP/Trusted Types concepts |
| 02 | 100,000 rows | CDK virtual scroll, precomputed search indexes, `trackBy`, `scrollToIndex` |
| 03 | Accessibility | `ActiveDescendantKeyManager`, `LiveAnnouncer`, `cdkTrapFocus`, ARIA listbox/dialog, focus restoration |
| 04 | Error reporting | global `ErrorHandler`, PII/secret scrubbing, correlation IDs, dedupe, release tagging |

### Generations
- **Gen 1:** the sanitizer, CDK a11y and scrolling (v5–v7), `ErrorHandler`: the foundations haven't changed.
- **Gen 2:** Trusted Types (v11), CSP nonces (v16), `provideBrowserGlobalErrorListeners`.
- **Gen 3 (v19–v22):** auto-CSP for prerendered pages, signal-based CDK APIs, Angular Aria headless components.

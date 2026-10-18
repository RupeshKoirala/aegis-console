# M26.01 · XSS & sanitization  ⏱ 50 min

A **security product** with an XSS is a headline. Analyst notes and partner-feed descriptions are user-controlled text, and the console renders them with formatting. One `<img src=x onerror=…>` executing in an analyst's session can read tokens, call the API as them, and silently unblock an attacker's IP.

Angular's defaults protect you:
- `{{ text }}` and `[textContent]` → always escaped
- `[innerHTML]` → **sanitized** (scripts, event handlers and `javascript:` URLs are stripped, with a console warning)
- `[href]`, `[src]` → URL-sanitized

The holes are always **self-inflicted**: `bypassSecurityTrustHtml(userInput)`, `ElementRef.nativeElement.innerHTML = …`, `document.write`, building HTML with string concatenation before escaping, and `eval`/`new Function`.

## Your tasks
- `notes.ts` TODO 1–3
- `threat-note.ts` TODO 4

## Senior notes
- **Escape first, then add your own markup.** Doing it the other way round is the classic bug. In production, prefer a vetted renderer (e.g. `marked` + DOMPurify) over regexes, but the order principle is the same.
- **Defence in depth:**
  - A strict **Content-Security-Policy** (`script-src 'self'`, no `unsafe-inline`; Angular supports CSP nonces via `ngCspNonce`).
  - **Trusted Types** (`require-trusted-types-for 'script'`, which Angular supports) make the browser reject raw-string `innerHTML` sinks.
  - HttpOnly cookies, so XSS can't read the refresh token.
- `bypassSecurityTrust*` belongs only on **constants you wrote** (e.g. an SVG icon string in the code), never on anything that came over the network.
- Gen 1/2/3: the sanitizer and contexts have been stable since v2. What changed is the *ecosystem*: Trusted Types support (v11+), CSP nonces (v16+), and auto-CSP for SSR/prerender (v19+).

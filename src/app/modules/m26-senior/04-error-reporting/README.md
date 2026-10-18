# M26.04 · Production error reporting  ⏱ 45 min

In production you can't open DevTools on the analyst's machine. Errors must be **reported**, which is a security-sensitive data flow, because reports go to a third party:

1. **Capture** everything uncaught: a global `ErrorHandler` (M15's interceptors handle the expected HTTP errors; this catches the rest).
2. **Scrub** tokens, JWTs, emails and secrets in URLs *before* sending. A monitoring dashboard full of bearer tokens is a breach.
3. **Correlate**: send the `X-Correlation-Id` (M12.04) so one ID finds the browser error *and* the backend logs. The integration series wires this end to end.
4. **Dedupe/rate-limit**: one broken poll must not send 10,000 reports (cost, noise, and a self-inflicted DoS on your monitoring).
5. **Release tag**: which deploy broke? Upload source maps to the monitoring tool, never to the public CDN.

## Your tasks: `error-reporter.ts` TODO 1–2

## Senior notes
- Pair this with **real user monitoring**: Web Vitals (LCP, INP, CLS) per route and per release. Performance regressions are bugs too.
- Don't report expected errors (a 401 that the refresh flow handles, a 404 the UI shows): that's noise that hides the real ones.
- `provideBrowserGlobalErrorListeners()` (already in `app.config.ts`) routes `window.onerror` and unhandled promise rejections into the `ErrorHandler`, so nothing escapes.
- **Gen 1/2:** `class X implements ErrorHandler` + `{ provide: ErrorHandler, useClass: X }` (unchanged). **Gen 3:** zoneless apps rely on `provideBrowserGlobalErrorListeners` to catch errors that zone.js used to funnel automatically.

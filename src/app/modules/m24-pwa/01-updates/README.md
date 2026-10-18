# M24.01 · App updates with `SwUpdate`  ⏱ 40 min

The on-call view is installed as a **PWA** (Add to home screen / Install app) and left open on a phone or a wall screen for days. A service worker caches the app, so it starts instantly and survives flaky networks. The price is **versioning**: after a deploy, an open tab keeps running the old code until it reloads.

```ts
sw.versionUpdates      // VERSION_DETECTED → VERSION_READY (downloaded) | VERSION_INSTALLATION_FAILED
sw.unrecoverable       // the cached version is broken (files evicted): only a reload helps
sw.checkForUpdate()    // ask the server now (it also checks on navigation/startup)
sw.activateUpdate()    // switch THIS tab to the new version… then reload so the new JS actually runs
```

## Your tasks: `app-updates.ts` TODO 1–5

## Lab: see it for real (30 min)
1. `npx ng add @angular/service-worker`. It adds `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000' })` to `app.config.ts`, plus `ngsw-config.json`.
2. `npx ng build` then `npx http-server dist/aegis-console/browser -p 8080 -c-1` (any static server).
3. Open http://localhost:8080/m24/01, and DevTools → Application → Service workers: it's registered.
4. Change some text, build again (the server keeps serving `dist`), click "Update" in DevTools or wait. The banner appears in the already-open tab. Click "Reload now".
5. DevTools → Network → **Offline**, reload: the app still starts.
6. Revert the `ng add` changes (the course app runs without a service worker).

## Senior notes
- **Never auto-reload** an app someone is working in: they lose their form, their filters, their place. Ask, or reload on the next navigation.
- Service workers only run on **HTTPS** (or localhost). They're powerful, so browsers protect them.
- A broken service worker deploy can strand users on an old version. Keep `ngsw.json`/`ngsw-worker.js` **un-cached** at the CDN (Cache-Control: no-cache), and know the kill switch (`safety-worker.js`).
- **Gen 1 (v5+):** `ServiceWorkerModule.register()` in AppModule, `SwUpdate.available` / `activated` observables. **Gen 2/3:** `provideServiceWorker()`, `versionUpdates` with typed events (the old observables were removed).

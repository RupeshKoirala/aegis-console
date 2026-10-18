# M24 · PWA & service worker

📖 **Read first (Study Hub):** `foundations/l25` caching everywhere · `foundations/l30` CI/CD & deployment · `angular-manual/m16` rendering & performance

| # | Exercise | You practise |
|---|---|---|
| 01 | App updates | `SwUpdate.versionUpdates`, `unrecoverable`, `checkForUpdate`, `activateUpdate`, user-friendly reloads, plus a production-build lab |
| 02 | Offline caching & stale chunks | `ngsw-config` asset/data groups, freshness vs performance, never caching auth, a `ChunkLoadError` recovery `ErrorHandler` |

### Generations
- **Gen 1 (v5–v13):** `ServiceWorkerModule.register()`, `SwUpdate.available/activated`.
- **Gen 2 (v14–v17):** `versionUpdates` typed events, `provideServiceWorker()`.
- **Gen 3 (v18–v22):** the same API with standalone apps, `registerWhenStable` defaults, and zoneless-friendly checks.

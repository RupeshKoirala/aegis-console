# M24.02 · Offline caching & stale chunks  ⏱ 40 min

**Caching strategy is a product and security decision.**
| Data | Strategy | Why |
|---|---|---|
| block lists, verdicts | `freshness` (network first, cache if offline/slow) | an analyst acting on a stale list could unblock an attacker |
| published reports | `performance` (cache first) | they change rarely, and speed matters |
| `/auth/**`, `/me` | **never cached** | tokens and identity must not sit on disk |

**Stale chunks.** Every deploy renames chunk files (content hashes). A tab opened before the deploy asks for `chunk-OLD123.js`, gets a 404, and the lazy route crashes with *"Failed to fetch dynamically imported module"*. The fix: detect that error and **reload once** to pick up the new `index.html`, with a guard so a genuinely broken deploy doesn't reload forever.

## Your tasks
- `ngsw-config.ts` TODO 1–2
- `chunk-errors.ts` TODO 3–4

## Senior notes
- Better than reacting: **avoid** it. Keep old chunks on the CDN for a few days after a deploy, so stale tabs keep working. S3 + CloudFront make this cheap (AWS series).
- The router can also catch it at navigation time: `provideRouter(routes, withNavigationErrorHandler(e => …))`.
- `freshness` with a `timeout` means a slow network falls back to cache after 3 s. Show the user that the data might be stale ("last updated 14:02").
- A service worker caches **GET** responses only. Offline writes (queue and sync later) need IndexedDB + Background Sync, which is a different, harder problem.

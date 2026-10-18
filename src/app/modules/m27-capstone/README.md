# M27 · Capstone: the investigation workspace  ⏱ 1–2 days

No step-by-step TODOs. This is a **ticket**, the way it would arrive at work. Templates and styles are done (`lookup.page.ts`, `list.page.ts`, `page.ts`); you write the logic. `acceptance.spec.ts` is the definition of done.

## The ticket
> **SOC-1432 · Investigation workspace.** Analysts get a ticket "is evil.example blocked for Acme, and why?". Today they click through four screens. Build one workspace:
> a verdict lookup whose URL can be pasted into the ticket, links from each match to the list, and list pages where they can add or remove indicators, with clear errors, and with nothing editable for read-only users.

## Requirements
| # | Where | Requirement |
|---|---|---|
| **R1** | `investigation.api.ts` | Typed methods for `GET /me`, `GET /verdict?q`, `GET /lists/{id}`, `GET /lists/{id}/indicators?size=200[&q]` (return `.items`), `POST` and `DELETE` indicators |
| **R2** | `investigation.store.ts` | Load the signed-in user once. `canEdit` = known user and not `READ_ONLY`. All mutations are no-ops when `!canEdit` |
| **R3** | store | Indicators reload when the open list changes, or the filter query settles (300 ms debounce, empty applies at once, latest wins, errors → `[]`) |
| **R4** | `lookup.page.ts` | `?q=` drives everything: invalid (not an IP/domain; a CIDR doesn't count) → message, **no request**. Valid → verdict via `httpResource`. Submitting writes the trimmed query to the URL |
| **R5** | store `add()` | Prepend on 201. `400` with `errors` → per-field messages (`addErrors.value`). Other problems → `addErrors._` = the detail |
| **R6** | store `remove()` | Optimistic, with in-place rollback + `error` = the problem detail on failure |
| **R7** | `routes.ts` | `''` → `lookup`, `lookup`, `lists/:listId` with `listResolver` (404 → back to `/m27/01/lookup`), `**` → `lookup` |

Run `npx ng test --include src/app/modules/m27-capstone` the whole time, and use `/m27/01` with `npm start` (the real fake API).

## Definition of done
- Acceptance tests green, the whole suite green (`npm test`), `npm run build` passes.
- Manual check with the API: look up `evil.example`, follow the match link, add `203.0.113.99`, try a duplicate, delete with `?_fail=500` (add it in DevTools or temporarily in the API service) and watch the rollback.
- **Write at least two tests of your own** (M22 style) for something the acceptance suite doesn't cover, e.g. that the lookup URL is shareable after a reload.
- **Self-review like a PR** (`git diff`):
  - any `subscribe` without cleanup?
  - mutation of signal contents?
  - a component doing HTTP directly instead of through the store/API?
  - user input bound to `innerHTML`?
  - would a READ_ONLY user see a button that only fails on click?

## Stretch goals
- Live updates: show a banner when the SSE stream (M11.04) reports a block for the list you're looking at.
- Undo for delete (5 s toast, M17/M21) instead of an immediate request.
- Export the list as CSV with a streamed download.
- An e2e journey for the whole workspace (M22.03).

When this is green, you've used nearly everything from M00–M26 in one feature. That's the frontend series. 🎉

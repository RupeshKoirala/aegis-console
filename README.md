# ◆ Aegis Console: hands-on Angular training

You're building the analyst console of **Aegis**, a threat-intelligence enforcement platform: tenants (and MSP child tenants), allow / block / threat lists, indicators (IP · CIDR · domain), verdicts, enforcement events, alerts and the audit log. It's the same domain as the Study Hub lessons, so everything you read there you **do** here.

Every exercise is a small, real feature. **The HTML, CSS, data and fake backend are done; you write the Angular.** Tests tell you when it's right.

## Setup (5 min)
1. **Node 22.22.3+ or 24.15+** (`node -v`). Angular 22 needs it.
2. WebStorm → *File → New → Project from Version Control* → this repo.
3. `npm install`
4. `npm start` runs the app (http://localhost:4200) **and** the fake API (http://localhost:3000).
5. Your own branch for your solutions: `git switch -c work && git push -u origin work`.
6. Do **M00.03 · Your debugging bench** early: it installs Angular DevTools and sets up the debugger you'll use in every lab.

## The loop
```
1. 📖 read     the Study Hub lessons listed in the module README
2. 🗺 map      open the module's Map (sidebar) and trace the arrows before coding
3. 📄 open     src/app/modules/mNN-…/NN-…/README.md
4. ▶ run      npm run ex -- m01/02          (tests in watch mode, red at first)
5. ✍ write    every TODO in that folder (WebStorm: Edit → Find → Find in Files → "TODO")
6. 👀 look     at it live in the sidebar, and in Angular DevTools
7. ✅ commit   when green:  git commit -am "m01/02"
8. 🧪 lab      after the module: src/app/modules/mNN-…/LAB.md
               observe in a debugger · break it on purpose · fix a seeded bug on a branch with one new git skill
```
Reference: **[docs/DEBUGGING.md](docs/DEBUGGING.md)** (which tool for which question) · **[docs/GIT.md](docs/GIT.md)** (the git track) · **[PASS2.md](PASS2.md)** (doing it all a second time).
Stuck for more than 15 minutes? Look at just that exercise's answer: `git diff main origin/solutions -- src/app/modules/m01-components/02-control-flow`

## Three generations, everywhere
You'll write **Gen 3 (v22)**. Each exercise also shows, in comments or in a paired exercise, how the same thing looked in **Gen 1 (v2–v15: NgModules, `@Input`, `*ngIf`, constructor injection, zone.js)** and **Gen 2 (v16–v20: standalone opt-in, first signals, `@if`, `input()`)**. That's because the code you'll meet at work is a mix of all three.

## Modules
All 28 modules (M00–M27) are in. See **[COURSE_MAP.md](COURSE_MAP.md)** for the full map and a progress checklist. M27 is a capstone: a ticket, requirements and an acceptance suite, with no step-by-step TODOs.

## The fake backend (`api/`)
- Implements the `/api/v1` contract in `api/openapi.yaml`, the same contract the backend series will later implement in Spring Boot.
- Users (password `password123`): `admin@acme.test` (ADMIN), `analyst@acme.test` (ANALYST), `viewer@acme.test` (READ_ONLY), `admin@globex.test`, `msp@shieldline.test` (MSP admin, can act for child tenants via `X-Tenant-Id`).
- Practise loading and error UIs: add `?_delay=1500` or `?_fail=500` to any request, or send the header `X-Chaos: 0.3`.
- `npm run api:reset` restores the seed data.

## Commands
| Command | What it does |
|---|---|
| `npm start` | app + fake API |
| `npm run ex -- m01/02` | one exercise's tests (watch) · `m01` = the whole module · add `--once` to run once |
| `npm run redo -- m05` | second pass: back up your M05 to branch `pass1/m05`, restore the starter files |
| `npm run diagrams` | rebuild the module maps (`public/diagrams/*.svg`) from `scripts/diagrams/specs/` |
| `npm run e2e` | Playwright end-to-end tests (M22.03; run `npx playwright install chromium` once) |
| `npm test` | all tests |
| `npm run api:reset` | wipe the fake database back to the seed |

> While exercises are unfinished you'll see the build warning `NG8113: All imports are unused`. It disappears as you complete the TODOs that use those imports.

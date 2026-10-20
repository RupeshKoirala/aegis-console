# Handoff: continuing the Aegis courses on your own machine

This branch (`authoring`) holds everything needed to keep building and studying locally. If you use Claude Code, start a session with: *"Read HANDOFF.md first."*

## Repos and branches
| Repo / branch | What it is |
|---|---|
| `aegis-console` · `main` | Angular 22 course, starter code with TODOs (M00–M27, 100+ exercises) |
| `aegis-console` · `solutions` | finished code; all specs green |
| `aegis-console` · `bug/mNN-*` | seeded-bug branches for the LAB.md bug hunts (M00–M09 so far; `bug/m08-injector-update` is the rebase drill) |
| `aegis-console` · `authoring` (this) | course **source** (`modules/` with `//@@sol` / `//@@stub` markers), build tools, learning pages, this file |
| `angular-3day` | the earlier 3-day Movie Browser course (finished) |
| your `work` branch | create it: `git switch -c work main && git push -u origin work` |

## How the course is built (tools/)
- `gen.mjs <stub|sol> <srcDir> <outDir>`: copies `modules/` into `src/app/modules`, keeping only the stub or the sol side of each marker block.
- `run.sh sol|stub <test path…>`: generate one variant and run those specs.
- `register.py`: adds a new module to `curriculum.ts` / COURSE_MAP.
- `publish.sh "<msg>"`: regenerate `main` (stub) and `solutions` (sol), commit both, push, sync `authoring`. Paths inside are absolute to the old cloud box (`/home/user/...`); change `GEN`, `SRC`, the repo paths and the Node toolchain path to your Mac paths before using it.
- `make-bugs.py`: builds `bug/*` branches from `origin/solutions` in a worktree, checks each one makes the module's specs fail, then pushes. Same path note as above.

## Status
- **Done:** M00–M27 exercises · debugging bench (M00.03) · `docs/DEBUGGING.md`, `docs/GIT.md` · module maps (SVG, `npm run diagrams`) for M00–M09 · `LAB.md` + bug branches for M00–M09 · `npm run redo` second-pass script · `PASS2.md`.
- **Next for aegis-console:** lab kit batch G2 (M10–M18) and G3 (M19–M27): one map spec in `scripts/diagrams/specs/`, a `LAB.md` and a bug branch per module, following the M00–M09 pattern.

## The Backend Path (current study priority)
| Layer | Days | Material |
|---|---|---|
| 1 Network (DNS, TCP/UDP, TLS, load balancers, anycast) | 0.5 | `pages/packet-to-postgres.html` + the terminal lab on it |
| 2 Backend basics (request lifecycle, auth, errors, logs) | 1 | lab to build in `aegis-work/backend-path/` |
| 3 Postgres (constraints, joins, indexes, transactions, migrations) | 2 | lab |
| 4 Spring Boot at review level | 1.5 | lab |
| 5 AWS, 12 services (Study Hub `aws/` manual first; video only for VPC, ELB, RDS, S3 presigned, ECS, Route 53) | 2 | Study Hub + lab |
| 6 Whole system: follow a DNS query and a portal click | 1 | `pages/packet-to-postgres.html` |

## Planned repo `aegis-work` (not created yet)
Monorepo, same `main` / `solutions` / `bug/*` tooling:
- `portal/`: Angular 21 + Material + zone.js, mirroring a real-world enterprise portal (permission-matrix guards, class interceptor, config initializer, DTO mappers, service state, config-driven tables, typed forms).
- `legacy/`: a Gen-1-style console to migrate from (NgModule, untyped forms, class guards, `Injector.get` base class, `ViewEncapsulation.None`).
- `e2e/`: Cypress.
- `billing-api/`: Spring Boot 3 + Postgres + Flyway.
- `lists-client/`: Feign library.
- `infra/`: docker-compose + LocalStack.

Batches: W1 = scaffold + portal P1–P4 + Spring S1–S3 + Postgres D1–D2; W2 = portal P5–P9 + migration H1–H6 + Cypress C1–C4; W3 = the rest + capstone. The Backend Path labs (layers 2–5) live in `aegis-work/backend-path/` and come first.

## Rules
- **No employer code, names, hosts or keys in any repo.** Courses re-create patterns in the fictional Aegis domain. Company-specific notes stay in private files that are never committed.
- Every exercise: sol passes, stub fails but compiles, the build passes. Every bug branch: the module's specs fail.

## Learning pages (open in a browser)
- `pages/security-hour.html`: Security in One Hour
- `pages/packet-to-postgres.html`: network, anycast simulator, whole-system map, AWS lecture list
- `pages/request-onion.html`: Observables and interceptors, step by step

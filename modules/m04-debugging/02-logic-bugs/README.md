# M04.02 · Debug the verdict engine  ⏱ 45 min

`verdict-engine.ts` decides whether traffic to an IP or domain is allowed for a tenant. It answers the same question as the API's `GET /api/v1/verdict`. It has **4 bugs**, and two of them are **security bugs**: they let traffic through that should be blocked, or block a partner that should be allowed.

The rules (from the Study Hub capstone):
1. Any **ALLOW** list match → `ALLOW` / `ALLOW_LIST` (**allow beats block**)
2. else any **BLOCK** list match → `BLOCK` / `BLOCK_LIST`
3. else a **THREAT** match with `score >= threshold` → `BLOCK` / `THREAT_SCORE`
4. else a threat match below the threshold → `NONE` / `BELOW_THRESHOLD`
5. else → `NONE` / `NO_MATCH`

A domain indicator `evil.example` covers `evil.example` and its subdomains (`www.evil.example`), but **not** `notevil.example`. A CIDR covers every address inside its prefix.

## How to work
1. Run `npm run ex -- m04/02` and pick **one** failing test.
2. Reproduce it in the page (`/m04/02`, type the query).
3. Set a breakpoint in `decide()` or `covers()` (Sources panel, or add `debugger;`), and step through until the state stops matching your expectation.
4. Fix it, and write the root cause in `BUGS.md`.

## Senior notes
- Matching untrusted strings with `includes()` / `startsWith()` / `endsWith()` without a boundary is a classic allow-list bypass (`evil.example.attacker.net`, `notevil.example`). Always compare whole labels.
- Bit maths in JavaScript runs on signed 32-bit integers. `~0 << 32` is **not** 0, because shift counts are taken mod 32. Use `>>> 0` to get unsigned values, and special-case `/0`.
- Boundaries (`>` vs `>=`) are where most business-rule bugs live. Tests should always cover the exact threshold value.

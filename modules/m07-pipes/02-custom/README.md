# M07.02 · Custom pipes: defang, CIDR size, relative time  ⏱ 45 min

Three pipes every SOC console needs:

| Pipe | Input → output | Why |
|---|---|---|
| `defang` | `http://evil.example/x` → `hxxp://evil[.]example/x` · `203.0.113.7` → `203[.]0[.]113[.]7` | so pasted IOCs aren't clickable or auto-linked in tickets and chats |
| `cidrSize` | `'198.51.100.0/24'` → `256` · with arg `'hosts'` → `254` · single IP → `1` | "how big a hole are we punching?" |
| `relativeTime` | `(iso, nowIso)` → `just now` · `20 min ago` · `3 h ago` · `2 d ago` | fast scanning of alert queues |

```ts
@Pipe({ name: 'cidrSize' })
export class CidrSizePipe implements PipeTransform {
  transform(value: string, mode: 'all' | 'hosts' = 'all'): number { … }    // {{ v | cidrSize: 'hosts' }}
}
```

## Your tasks: TODO 1–3 in the three pipe files, TODO 4 in `page.html`

## Senior notes
- Keep pipes **pure and cheap**, with no HTTP and no injected mutable state. They run in templates, potentially for every row.
- `relativeTime` takes `now` as a **parameter** instead of calling `Date.now()`. That keeps it pure and testable, and when the caller passes a ticking `now()` signal, the pipe re-runs exactly when it should.
- Pipes are also plain classes: `new DefangPipe().transform(x)` works in services and tests.

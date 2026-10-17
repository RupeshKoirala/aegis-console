# M11.04 · Live attack stream (SSE)  ⏱ 50 min

The fake API pushes enforcement events over **Server-Sent Events**: `GET /api/v1/events/stream` with `event: traffic`. Build the live panel:
- the last **20** events (newest first)
- **events per second** (count per 1 s window)
- a running **blocked** total

```ts
const events$ = new Observable<TrafficEvent>(subscriber => {
  const source = this.open(url);                      // EventSource, behind an injectable factory, so tests can fake it
  source.addEventListener('traffic', e => subscriber.next(JSON.parse((e as MessageEvent).data)));
  source.onerror = () => subscriber.error(new Error('stream lost'));
  return () => source.close();                        // ← closing the connection is the teardown
}).pipe(share());                                     // one connection, many readers

recent$    = events$.pipe(scan((acc, e) => [e, ...acc].slice(0, 20), [] as TrafficEvent[]));
perSecond$ = events$.pipe(bufferTime(1000), map(batch => batch.length));
blocked$   = events$.pipe(filter(e => e.action === 'BLOCK'), scan(n => n + 1, 0));
```
Without `share()`, every reader opens its **own** HTTP connection: three streams means three connections to the server.

## Your tasks: `live-events.service.ts` TODO 1–4
`npm start`, then open `/m11/04` to watch it live. (`EventSource` can't send headers, so the token goes in `?access_token=`.)

## Senior notes
- SSE vs WebSocket: SSE is one-way (server → client), plain HTTP, auto-reconnects, and works through proxies easily. WebSocket is two-way. For dashboards, SSE is usually enough.
- Real systems need reconnection with backoff (`retry({ delay: (err, n) => timer(min(2**n * 1000, 30000)) })`) and resumption with `Last-Event-ID`.
- Tokens in query strings end up in server logs and browser history. Use short-lived, stream-only tokens, or cookies.

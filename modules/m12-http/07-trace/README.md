# M12.07 · Trace the onion  ⏱ 30 min

📺 **Watch first:** the interactive explainer [Request Onion Lab](https://claude.ai/artifact/Hgi3ywBpyBX1qgrUPnBDwG) (private to your account). It steps one request through these exact three interceptors, with a millisecond clock.

Now *see* it in your own code. Three interceptors that each write to a log:

```ts
export const traceLoading: HttpInterceptorFn = (req, next) => {
  const log = inject(TraceLog);
  log.add('loading:out');                                       // ← runs on the WAY OUT
  return next(req).pipe(finalize(() => log.add('loading:finalize')));   // ← runs on the WAY BACK
};
```
The math:
```
http.get = loading( · , auth( · , unauthorized( · , server )))
result   = p1( p2( p3( S( r3( r2( r1(req) ))))))      r1 runs first on the way out, p3 first on the way back
```
The tests pin down the exact order you should see:
```
success: loading:out → auth:out → unauth:out → component:after-subscribe → auth:back → component:next → loading:finalize
401:     … → unauth:caught 401 → auth:back-error → component:error 401 → loading:finalize
cancel:  … → loading:finalize                       (no next, no error)
```
Notice `component:after-subscribe` comes **before** any response: `subscribe()` returns immediately, and the data arrives later.

## Your tasks: `trace.interceptors.ts` TODO 1–4
Then open `/m12/07` with `npm start` and press the three buttons. You'll see real millisecond gaps between the way out and the way back.

## Senior notes
- Interceptors see **`HttpEvent`s**, not just the body: a `Sent` event first, then the `Response` (and progress events if you ask for them). That's why `auth:back` filters on `HttpEventType.Response`.
- The order of `withInterceptors([...])` **is** the order of the onion: the first one is the outermost layer.
- An interceptor that forgets to `return next(...)` silently kills every request. An interceptor that catches without rethrowing turns failures into "success". The tests catch both.

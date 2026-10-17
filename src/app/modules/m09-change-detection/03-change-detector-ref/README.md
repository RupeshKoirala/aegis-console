# M09.03 · `ChangeDetectorRef`: `markForCheck` & `detach`  ⏱ 40 min

Gen 1 and Gen 2 code is full of `ChangeDetectorRef`. You must recognise both patterns, and know when signals make them unnecessary.

1. **`markForCheck()`:** "my data changed outside a template event, please check me and my ancestors on the next pass". You see it after `setTimeout`, WebSocket callbacks and subscriptions in OnPush components. (The `async` pipe calls it for you.)
2. **`detach()` + `detectChanges()`:** take a component out of automatic CD and render it **yourself**, for example at most twice a second for a feed that pushes 50 updates/s. This is a legit performance tool for very hot views.

```ts
private readonly cdr = inject(ChangeDetectorRef);
this.cdr.markForCheck();
this.cdr.detach();  setInterval(() => this.cdr.detectChanges(), 500);
```

## Your tasks: `legacy-feed-status.ts` TODO 1, `throttled-counter.ts` TODO 2–3

## Senior notes
- With signals you almost never need `markForCheck`. Signal writes mark readers dirty automatically. Treat `markForCheck` in new code as a smell.
- `detectChanges()` checks **this subtree now, synchronously**. `markForCheck()` only **schedules**. Mixing them up causes either stale views or performance bugs.

# M10.03 · `untracked` & effect cleanup  ⏱ 35 min

Two real requirements on the **search page**:
1. **Analytics:** log `search "<query>" by <user>` once the query has been stable for 300 ms (debounce). Changing the *user* must **not** log a search, so read the user with `untracked`.
2. Each new keystroke must **cancel** the previous pending timer, using the effect's `onCleanup`.

```ts
effect(onCleanup => {
  const q = this.query();                         // tracked: re-run when the query changes
  const who = untracked(() => this.user());       // read, but don't subscribe
  const t = setTimeout(() => log(q, who), 300);
  onCleanup(() => clearTimeout(t));               // runs before the next run AND on destroy
});
```

## Your tasks: `page.ts` TODO 1–3

## Senior notes
- `effect` is for **side effects** (logging, storage, DOM, analytics), not for deriving state.
- Forgetting `onCleanup` with timers or subscriptions leaks, and produces "ghost" updates after the component is gone.
- `untracked` is also how you call a service method inside an effect without accidentally subscribing to every signal that method reads.

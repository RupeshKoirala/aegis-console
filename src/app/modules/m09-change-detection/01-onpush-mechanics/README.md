# M09.01 · OnPush: why is the card stale?  ⏱ 35 min

An alert card, with two bugs every Angular team has shipped:
1. **"Resolve" doesn't update the card.** The parent does `alert.status = 'RESOLVED'`, which **mutates** the object the card received. The input reference is the same, so the OnPush card is never checked.
2. **The "seen N s ago" counter never moves.** The card updates a plain field from `setInterval`. That's no event, no input change and no signal, so in a zoneless OnPush app nothing re-renders.

## Your tasks
- `page.ts` TODO 1: make `resolve()` produce a **new** alert object.
- `alert-card.ts` TODO 2: make `secondsAgo` a **signal**.

## Senior notes
- "Immutable data + OnPush" was the Gen 1 performance recipe. Gen 3 replaces most of it with **signals**, but immutability still matters for inputs and `computed` equality.
- Never "fix" OnPush bugs by switching the component to Eager. That hides the data-flow problem and costs performance everywhere.

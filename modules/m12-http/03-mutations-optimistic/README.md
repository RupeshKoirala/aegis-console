# M12.03 · POST, DELETE & optimistic updates  ⏱ 50 min

The **Manual blocks** list (`listId = 2`): add an indicator, remove one.
- **Add** → `POST /api/v1/lists/2/indicators` with `{ value, description }`. Success is `201` + a `Location` header + the created `IndicatorView`. Prepend it. A duplicate gives `409` with a problem `detail`, which you show next to the form.
- **Remove** → **optimistically**: take the row away *immediately*, then `DELETE`. If the server says no (403 as READ_ONLY, 404, 500), **put it back** where it was and show the error.

```ts
const snapshot = this.items();
this.items.update(list => list.filter(i => i.id !== id));    // the UI reacts instantly
this.http.delete(url).subscribe({ error: err => { this.items.set(snapshot); this.error.set(toProblem(err)); } });
```

## Your tasks: `block-list.store.ts` TODO 1–3

## Senior notes
- Optimistic UI is great for **reversible, low-risk, usually-succeeding** actions. For destructive or expensive ones (deleting a whole list), confirm first and wait for the server.
- Concurrent optimistic edits need care: restore *that item*, not a whole stale snapshot, if other changes happened in between. The tests keep it simple. Production code often keys rollbacks by id.
- Read `Location` with `observe: 'response'` when you need the new resource's URL (e.g. to navigate to it).

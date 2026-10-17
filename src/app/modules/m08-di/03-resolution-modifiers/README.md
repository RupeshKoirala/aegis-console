# M08.03 · `optional` / `self` / `skipSelf` / `host`  ⏱ 35 min

A **tenant tree** (MSP → child tenants → sites) built from nested `<aegis-tree-node>` components. Each node finds its **parent node through DI**, with no inputs passed down, and computes its own depth and path.

```ts
// Gen 3
private readonly parent = inject(TreeNode, { skipSelf: true, optional: true });
// Gen 1
constructor(@Optional() @SkipSelf() private parent: TreeNode | null) {}
```
| Option | Meaning |
|---|---|
| `optional: true` | return `null` instead of throwing NG0201 |
| `self: true` | look **only** on this element's own injector |
| `skipSelf: true` | start at the **parent**, skipping my own element (needed when I provide/am the token myself) |
| `host: true` | stop at the host component's boundary (don't look above it) |

`TreeNode` injecting `TreeNode` without `skipSelf` would find **itself**. Without `optional`, the root node would crash.

## Your tasks: `tree-node.ts` TODO 1–3, `theme-probe.ts` TODO 4

## Senior notes
- This "find my ancestor via DI" pattern powers Angular's own forms (`ControlContainer`), CDK menus, accordion items, and more.
- `self` is how a directive asks "is there an `NgControl` **on this same element**?", for example a `[required]` directive that only makes sense next to `ngModel`.

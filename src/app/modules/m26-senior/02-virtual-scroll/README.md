# M26.02 · 100,000 rows: virtual scrolling  ⏱ 45 min

A threat feed import can have **100k+ indicators**. Rendering them all creates 100k × ~5 DOM nodes: seconds of freeze, around a gigabyte of memory, and every change-detection pass walks all of it. **Virtual scrolling** renders only the ~20 visible rows plus a buffer, and recycles them as you scroll:

```html
<cdk-virtual-scroll-viewport [itemSize]="32" minBufferPx="320" maxBufferPx="640" style="height: 480px">
  <div *cdkVirtualFor="let r of rows(); trackBy: byId" style="height: 32px">…</div>
</cdk-virtual-scroll-viewport>
```
The data side matters just as much: filtering 100k objects per keystroke must not allocate 100k strings. Build an **index** once (`buildIndex`), then searching is one `includes` per row.

## Your tasks
- `big-list.ts` TODO 1–2
- `page.ts` TODO 3–4

Open `/m26/02` with DevTools → Performance → record while scrolling. Then look at Elements: only a few dozen `.row-item`s exist.

## Senior notes
- Fixed-height rows are simplest and fastest. Variable heights need `autosize` (experimental) or measuring, and they make "jump to row N" approximate.
- Accessibility: virtualized lists hide most rows from screen readers. Add `aria-rowcount` / `aria-rowindex`, and make sure search and keyboard navigation reach every row.
- Other options for huge data: **server-side** pagination/filtering (the real answer for millions of rows, via `GET /lists/{id}/indicators?q=&page=`), Web Workers for heavy client-side filtering, and `@defer` for below-the-fold sections.
- `trackBy` (or `track` in `@for`) is essential here too: it lets the CDK reuse DOM nodes instead of recreating them.

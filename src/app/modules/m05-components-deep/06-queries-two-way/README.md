# M05.06 · View queries & custom two-way binding  ⏱ 45 min

A **tag input** for labelling indicators (`phishing`, `incident-42`…): type, press Enter, get a chip, click ✕ to remove one. The parent binds it two-way: `[(tags)]="labels"`.

## Concepts
```ts
// Gen 3
tags  = model<string[]>([]);                                         // two-way
entry = viewChild.required<ElementRef<HTMLInputElement>>('entry');   // one element from MY template
chips = viewChildren<ElementRef<HTMLElement>>('chip');               // all matches, as a signal of an array
// the parent can query a child COMPONENT too:
tagInput = viewChild.required(TagInput);   this.tagInput().focus();
```
```ts
// Gen 1: the two-way pair. [(tags)] works when an output is named <input>Change
@Input() tags: string[] = [];
@Output() tagsChange = new EventEmitter<string[]>();
@ViewChild('entry') entry!: ElementRef<HTMLInputElement>;      // only set from ngAfterViewInit on
```

## Your tasks: `tag-input.ts` TODO 1–4 · `legacy-tag-input.ts` TODO 5 · `page.ts` TODO 6

## Senior notes
- Reach for `viewChild` only for **imperative** things: focus, scroll, measuring, third-party widgets. Data should flow through bindings.
- Prefer a child-component query (`viewChild(TagInput)`) plus a public method over grabbing a child's DOM. It respects encapsulation.
- `{ read: ElementRef }` / `{ read: ViewContainerRef }` changes *what* a query returns for the same match.

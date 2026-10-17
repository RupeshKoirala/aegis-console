# M06.01 · Attribute directive: severity highlight  ⏱ 35 min

`<tr [aegisSeverity]="'CRITICAL'">` gives any element a coloured severity edge and a tooltip, and makes CRITICAL rows pulse. Write it once, use it on rows, cards and badges everywhere.

## Concepts
```ts
@Directive({
  selector: '[aegisSeverity]',
  host: { '[style.border-left]': 'edge()', '[attr.title]': '"Severity: " + severity()' },
})
export class SeverityHighlight {
  readonly severity = input.required<Severity>({ alias: 'aegisSeverity' });   // <tr [aegisSeverity]="…">
  private readonly el = inject(ElementRef<HTMLElement>);   // the host DOM element
  private readonly renderer = inject(Renderer2);           // safe DOM writes (also works on the server)
}
```
- Prefer `host` bindings. Use `Renderer2` for imperative work bindings can't express (adding classes conditionally from code, `setAttribute` from a library…).
- Direct `el.nativeElement.style.x = …` works in the browser but breaks SSR and bypasses Angular. It's a Gen 1 habit to avoid.

**Gen 1:** `@HostBinding('style.border-left') get edge()`, `constructor(private el: ElementRef, private r: Renderer2) {}`, and `ngOnChanges` to react to input changes. **Gen 3:** `host` + `inject()` + `effect()`.

## Your tasks: `severity-highlight.ts` TODO 1–4

## Senior notes
- Directives on the same element share **one** injector node: a directive can `inject()` the host component or another directive on that element.
- Name directive selectors with your prefix (`aegis…`), because attribute names collide just like tags.

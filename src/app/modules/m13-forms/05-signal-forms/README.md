# M13.05 · Signal Forms  ⏱ 60 min

This is the same form as M13.02, built the Gen 3 way. There's no `FormGroup`. **Your model is a signal**, and `form()` wraps it in a tree of fields. Each field is a function that returns its state as signals.

```ts
model = signal<NewIndicator>({ ...EMPTY });
f = form(this.model, indicatorSchema);

f.value().value()      // the string, a WritableSignal (writes go straight into model)
f.value().errors()     // [{ kind: 'required', message: 'Required' }]
f.value().touched() / dirty() / valid() / invalid() / pending() / hidden() / disabled()
f().valid()            // the whole form
```
```html
<input [formField]="f.value" />      <!-- one directive for every native control and custom FormValueControl -->
```
Validation is a **schema function**, written once and reusable:
```ts
export const indicatorSchema = schema<NewIndicator>(p => {
  required(p.value, { message: 'Required' });
  validate(p.value, ({ value }) => isBad(value()) ? { kind: 'indicator', message: '…' } : undefined);
  applyWhen(p, ({ value }) => value().listKind === 'THREAT', t => { required(t.score); });
  hidden(p.category, ({ valueOf }) => valueOf(p.listKind) !== 'THREAT');
});
```
`submit(f, async () => { … })` marks everything touched, runs the action only when the form is valid, and sets `submitting()` while it runs.

## Your tasks
- `indicator.schema.ts` TODO 1–3
- `page.ts` TODO 4

## Senior notes
- Cross-field rules are simply logic that reads other fields: `valueOf(p.listKind)`. There's no separate group validator concept.
- Server checks: `validateHttp(p.value, { request: ({ value }) => …, onSuccess: … })` is the Signal Forms version of M13.02's async validator, built on `httpResource`.
- Server errors **after** submit: return them from the submit action (`[{ fieldTree: f.value, kind: 'server', message: detail }]`) and they appear on that field. That's how a 409 from the API maps onto the form.
- Adoption advice: new forms in a v21+ code base → Signal Forms. Existing reactive forms → leave them, and use `toSignal` to bridge (M13.03).
- Reviewing old code, you'll see all three generations side by side. 01, 02 and 05 of this module are the same form, so diff them.

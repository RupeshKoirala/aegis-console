import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormField, form, submit } from '@angular/forms/signals';
import { THREAT_CATEGORIES } from '../indicator-format';
import { EMPTY, NewIndicator, indicatorSchema } from './indicator.schema';

@Component({
  selector: 'app-m13-05',
  imports: [FormField, JsonPipe],
  template: `
    <h1>Add indicator <small class="muted">Signal Forms</small></h1>
    <form class="card stack" (submit)="$event.preventDefault(); save()" novalidate>
      <label>List
        <select [formField]="f.listKind">
          <option value="ALLOW">Partner allow list</option><option value="BLOCK">Manual blocks</option><option value="THREAT">Webroot sample (threat)</option>
        </select>
      </label>
      <label>Indicator <input class="mono value" [formField]="f.value" /></label>
      @if (f.value().touched() && f.value().invalid()) {
        <p class="error-text value-error">{{ f.value().errors()[0].message }}</p>
      }
      @if (!f.category().hidden()) {
        <div class="row threat">
          <label>Category <select [formField]="f.category"><option value="">–</option>
            @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }</select></label>
          <label>Score <input type="number" [formField]="f.score" /></label>
        </div>
      }
      <label>Why? <textarea rows="2" [formField]="f.description"></textarea></label>
      <small class="muted">{{ model().description.length }}/200</small>
      <button class="primary" [disabled]="f().invalid() || f().submitting()">Add</button>
    </form>
    <h3>Saved</h3>
    <ul class="card saved">@for (s of saved(); track $index) { <li class="mono">{{ s.listKind }} · {{ s.value }}</li> }</ul>
    <details><summary>model()</summary><pre>{{ model() | json }}</pre></details>
  `,
  styles: `form { max-width: 560px; } textarea { width: 100%; } .threat label { flex: 1; }`,
})
export class Page {
  protected readonly categories = THREAT_CATEGORIES;
  /** The model IS the source of truth: the form is a view over this signal. */
  readonly model = signal<NewIndicator>({ ...EMPTY });
  readonly f = form(this.model, indicatorSchema);
  readonly saved = signal<NewIndicator[]>([]);

//@@sol
  save() {
    return submit(this.f, async () => {
      const v = this.model();
      this.saved.update(list => [...list, { ...v, value: v.value.trim().toLowerCase() }]);
      this.f().reset({ ...EMPTY });
      return undefined;
    });
  }
//@@stub
  // TODO 4: save() with submit(this.f, async () => { ... }):
  //   submit() marks every field touched and only runs your action when the form is valid.
  //   In the action: append the model (value trimmed + lower-cased) to saved, then this.f().reset({ ...EMPTY }).
  //   Return the promise submit() gives you (the tests await it).
  save(): Promise<boolean> {
    return Promise.resolve(false);
  }
//@@end
}

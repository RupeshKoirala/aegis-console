import { Component, computed } from '@angular/core';
//@@sol
import { toSignal } from '@angular/core/rxjs-interop';
//@@end
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { THREAT_CATEGORIES } from '../indicator-format';
import { RuleForm, newRule, noDuplicateCategories } from './rules';

@Component({
  selector: 'app-m13-03',
  imports: [ReactiveFormsModule],
  template: `
    <h1>Threat policy <small class="muted">FormArray</small></h1>
    <p class="muted">Rules run top to bottom. The first matching rule wins.</p>
    <div class="card stack">
      @for (rule of rules.controls; track rule; let i = $index, first = $first, last = $last) {
        <div class="row rule" [formGroup]="rule">
          <span class="mono muted">#{{ i + 1 }}</span>
          <select formControlName="category"><option value="">category…</option>
            @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }</select>
          <label>score ≥ <input type="number" formControlName="minScore" class="score" /></label>
          <select formControlName="action"><option>BLOCK</option><option>ALERT</option></select>
          <button class="up" (click)="moveUp(i)" [disabled]="first">↑</button>
          <button class="remove danger" (click)="remove(i)">✕</button>
        </div>
      }
      <div class="row">
        <button class="add" (click)="add()">+ Rule</button>
        @if (rules.errors?.['duplicateCategory']; as c) { <span class="error-text dup">"{{ c }}" appears twice. Only the first one would ever match.</span> }
      </div>
    </div>
    <h3>Preview</h3>
    <ol class="card preview">@for (line of summary(); track $index) { <li class="mono">{{ line }}</li> }</ol>
    <button class="primary" [disabled]="rules.invalid">Save policy</button>
  `,
  styles: `.rule { gap: 8px; } .score { width: 70px; }`,
})
export class Page {
  protected readonly categories = THREAT_CATEGORIES;
  readonly rules = new FormArray<RuleForm>([newRule('Botnets', 90), newRule('Phishing', 80), newRule('Scanners', 60, 'ALERT')], {
    validators: noDuplicateCategories,
  });

//@@sol
  private readonly value = toSignal(this.rules.valueChanges, { initialValue: this.rules.getRawValue() });
  readonly summary = computed(() => this.value().map(r => `${r.action} ${r.category || '?'} when score ≥ ${r.minScore}`));

  add() {
    this.rules.push(newRule());
  }
  remove(i: number) {
    this.rules.removeAt(i);
  }
  moveUp(i: number) {
    if (i <= 0) return;
    const row = this.rules.at(i);
    this.rules.removeAt(i, { emitEvent: false });
    this.rules.insert(i - 1, row);
  }
//@@stub
  // TODO 3: summary: a signal of lines like "BLOCK Botnets when score ≥ 90" (use '?' for an empty category)
  //         that updates as the user edits. Bridge with toSignal(this.rules.valueChanges, { initialValue: ... }).
  readonly summary = computed(() => [] as string[]);

  // TODO 4: add() pushes newRule(); remove(i) removes row i; moveUp(i) swaps row i with the one above
  //         (keep the SAME FormGroup instance, don't copy values; emit ONE valueChanges for the move).
  add() {}
  remove(_i: number) {}
  moveUp(_i: number) {}
//@@end
}

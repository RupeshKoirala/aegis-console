import { Component, signal } from '@angular/core';
//@@sol
import { FormsModule, NgForm } from '@angular/forms';
//@@end
import { INDICATOR_PATTERN } from '../indicator-format';

export interface BlockRequest { value: string; description: string; notifySoc: boolean }

@Component({
  selector: 'app-m13-01',
//@@sol
  imports: [FormsModule],
//@@stub
  // TODO 1: import FormsModule (it brings ngModel, ngForm and the template validators)
  imports: [],
//@@end
  template: `
    <h1>Block an indicator <small class="muted">template-driven</small></h1>
<!--@@sol-->
    <form #f="ngForm" (ngSubmit)="add(f)" class="card stack" novalidate>
      <label>Indicator
        <input name="value" class="mono" placeholder="203.0.113.7, 198.51.100.0/24 or evil.example"
               [(ngModel)]="value" required [pattern]="pattern" #valueCtrl="ngModel" />
      </label>
      @if (valueCtrl.invalid && (valueCtrl.touched || f.submitted)) {
        <p class="error-text value-error">
          @if (valueCtrl.hasError('required')) { Required. } @else { Must be an IPv4 address, IPv4 CIDR or domain. }
        </p>
      }
      <label>Why?
        <textarea name="description" rows="2" [(ngModel)]="description" maxlength="200"></textarea>
      </label>
      <small class="muted count">{{ description().length }}/200</small>
      <label class="row"><input type="checkbox" name="notifySoc" [(ngModel)]="notifySoc" /> Notify the SOC channel</label>
      <button class="primary" type="submit" [disabled]="f.invalid">Block</button>
    </form>
<!--@@stub-->
    <!-- TODO 2: turn this into a template-driven form:
         - <form #f="ngForm" (ngSubmit)="add(f)" novalidate>
         - every input gets a name + [(ngModel)] bound to the signal of the same name
         - value: required + [pattern]="pattern", exported as #valueCtrl="ngModel"
         - TODO 3: show <p class="error-text value-error"> only when valueCtrl is invalid AND (touched OR f.submitted):
                   "Required." or "Must be an IPv4 address, IPv4 CIDR or domain."
         - TODO 4: a live counter <small class="count">{{ description().length }}/200</small>, and the Block button
                   is [disabled] while f.invalid -->
    <div class="card stack">
      <label>Indicator <input class="mono" placeholder="203.0.113.7, 198.51.100.0/24 or evil.example" /></label>
      <label>Why? <textarea rows="2"></textarea></label>
      <label class="row"><input type="checkbox" /> Notify the SOC channel</label>
      <button class="primary">Block</button>
    </div>
<!--@@end-->
    <h3>Queued</h3>
    <ul class="card queued">
      @for (r of added(); track $index) {
        <li class="row"><span class="mono">{{ r.value }}</span> <span class="muted">{{ r.description }}</span>
          @if (r.notifySoc) { <span class="badge">notify</span> }</li>
      } @empty { <li class="muted">Nothing queued yet.</li> }
    </ul>
  `,
  styles: `form, .card.stack { max-width: 560px; } textarea { width: 100%; } .queued li { padding: 4px 0; }`,
})
export class Page {
  protected readonly pattern = INDICATOR_PATTERN;
  readonly value = signal('');
  readonly description = signal('');
  readonly notifySoc = signal(true);
  readonly added = signal<BlockRequest[]>([]);

//@@sol
  add(f: NgForm) {
    if (f.invalid) return;
    this.added.update(list => [{ value: this.value().trim().toLowerCase(), description: this.description(), notifySoc: this.notifySoc() }, ...list]);
    f.resetForm({ value: '', description: '', notifySoc: true });
  }
//@@stub
  // TODO 5: add(f: NgForm): ignore invalid submits; prepend { value (trimmed, lower-case), description, notifySoc }
  //         to added, then f.resetForm({ value: '', description: '', notifySoc: true }) so touched/submitted reset too.
  add(_f: unknown) {}
//@@end
}

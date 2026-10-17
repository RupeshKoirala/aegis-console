import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { INDICATOR_PATTERN } from '../indicator-format';

export interface BlockRequest { value: string; description: string; notifySoc: boolean }

@Component({
  selector: 'app-m13-01',
  imports: [FormsModule],
  template: `
    <h1>Block an indicator <small class="muted">template-driven</small></h1>
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

  add(f: NgForm) {
    if (f.invalid) return;
    this.added.update(list => [{ value: this.value().trim().toLowerCase(), description: this.description(), notifySoc: this.notifySoc() }, ...list]);
    f.resetForm({ value: '', description: '', notifySoc: true });
  }
}

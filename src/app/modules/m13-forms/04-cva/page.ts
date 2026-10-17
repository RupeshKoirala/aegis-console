import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CidrInput } from './cidr-input';

@Component({
  selector: 'app-m13-04',
  imports: [CidrInput, ReactiveFormsModule],
  template: `
    <h1>Block a range <small class="muted">ControlValueAccessor</small></h1>
    <div class="card stack">
      <!-- TODO 5: bind [formControl]="range" once TODO 1–2 work (before that Angular throws "No value accessor") -->
      <aegis-cidr-input />
      <p class="mono" [attr.data-tick]="tick()">value: "{{ range.value }}" · {{ range.status }} · {{ range.touched ? 'touched' : 'untouched' }}</p>
      @if (range.hasError('cidr')) { <p class="error-text">"{{ range.getError('cidr').ip }}" is not an IPv4 address.</p> }
      <label class="row"><input type="checkbox" (change)="toggle()" /> lock (disable the control)</label>
      <button (click)="range.setValue('203.0.113.0/24')">Set from code → 203.0.113.0/24</button>
    </div>
  `,
})
export class Page {
  readonly range = new FormControl('198.51.100.0/24', { nonNullable: true, validators: [Validators.required] });
  readonly tick = signal(0);
  constructor() {
    // Reactive forms don't notify OnPush templates; nudge a signal so the debug line stays current.
    this.range.events.subscribe(() => this.tick.update(n => n + 1));
  }
  toggle() {
    if (this.range.disabled) this.range.enable();
    else this.range.disable();
  }
}

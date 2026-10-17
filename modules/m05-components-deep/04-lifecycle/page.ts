import { Component, inject, signal } from '@angular/core';
import { HookProbe } from './hook-probe';
import { LifecycleLog } from './lifecycle-log';

@Component({
  selector: 'app-m05-04',
  imports: [HookProbe],
  template: `
    <h1>Lifecycle lab</h1>
    <div class="row">
      <button class="toggle" (click)="show.set(!show())">{{ show() ? 'Destroy probe' : 'Create probe' }}</button>
      <button class="rename" (click)="label.set(label() + '!')">Change input</button>
      <button class="clear" (click)="log.clear()">Clear log</button>
    </div>
    @if (show()) { <aegis-hook-probe [label]="label()" /> }
    <ol class="log card mono">
      @for (e of log.entries(); track $index) { <li>{{ e }}</li> }
    </ol>
  `,
  styles: `.log { font-size: 13px; max-height: 420px; overflow: auto; } .probe { margin: 12px 0; }`,
})
export class Page {
  protected readonly log = inject(LifecycleLog);
  readonly show = signal(true);
  readonly label = signal('alpha');
}

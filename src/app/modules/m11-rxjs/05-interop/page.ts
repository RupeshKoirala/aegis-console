import { Component, signal } from '@angular/core';
import { AlertPanel } from './alert-panel';

@Component({
  selector: 'app-m11-05',
  imports: [AlertPanel],
  template: `
    <h1>Alert panel (migrated)</h1>
    <button class="toggle" (click)="show.set(!show())">{{ show() ? 'Hide' : 'Show' }} panel</button>
    @if (show()) { <aegis-alert-panel /> }
  `,
})
export class Page {
  readonly show = signal(true);
}

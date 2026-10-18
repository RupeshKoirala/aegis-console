import { Component, input, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * Gen 1/2 code, the way you'll find it in existing apps (Angular ≤ 20). Read it, then port it (TODO 2).
 * It needs provideAnimationsAsync() (see module.ts), which is deprecated and goes away in v23.
 */
@Component({
  selector: 'aegis-legacy-panel',
  animations: [
    trigger('expand', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed => expanded', animate('200ms ease-out')),
      transition('expanded => collapsed', animate('150ms ease-in')),
    ]),
  ],
  template: `
    <button class="header" (click)="open.set(!open())" [attr.aria-expanded]="open()">{{ title() }} {{ open() ? '▾' : '▸' }}</button>
    <div class="body" [@expand]="open() ? 'expanded' : 'collapsed'"><ng-content /></div>
  `,
})
export class LegacyPanel {
  readonly title = input('');
  readonly open = signal(false);
}

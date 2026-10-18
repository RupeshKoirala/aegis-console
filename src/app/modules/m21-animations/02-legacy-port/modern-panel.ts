import { Component, input, signal } from '@angular/core';

/**
 * TODO 2: the SAME panel without @angular/animations:
 *   - keep the button (class "header", aria-expanded) and the .body wrapper with <ng-content />
 *   - bind [class.open]="open()" on the .body
 *   - CSS: animate height with the grid trick, which works for unknown ("auto") heights:
 *       .body { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 200ms ease-out, opacity 200ms; }
 *       .body.open { grid-template-rows: 1fr; opacity: 1; }
 *       .body > .inner { overflow: hidden; }            (wrap <ng-content /> in <div class="inner">)
 *       @media (prefers-reduced-motion: reduce) { .body { transition: none; } }
 */
@Component({
  selector: 'aegis-modern-panel',
  template: `
    <button class="header" (click)="open.set(!open())" [attr.aria-expanded]="open()">{{ title() }} {{ open() ? '▾' : '▸' }}</button>
    <div class="body" [class.open]="open()"><div class="inner"><ng-content /></div></div>
  `,
  styles: `
    .body { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 200ms ease-out, opacity 200ms; }
    .body.open { grid-template-rows: 1fr; opacity: 1; }
    .body > .inner { overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { .body { transition: none; } }
  `,
})
export class ModernPanel {
  readonly title = input('');
  readonly open = signal(false);
}

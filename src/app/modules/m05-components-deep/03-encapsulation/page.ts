import { Component, signal } from '@angular/core';
import { SeverityBadge } from './severity-badge';
import { ShadowBadge } from './shadow-badge';
import { GlobalReset } from './global-reset';

@Component({
  selector: 'app-m05-03',
  imports: [SeverityBadge, ShadowBadge, GlobalReset],
  template: `
    <h1>Encapsulation lab</h1>
    <aegis-global-reset />
    <label class="row"><input type="checkbox" [checked]="dark()" (change)="dark.set(!dark())" /> dark-tenant theme</label>
    <section class="card" [class.dark-tenant]="dark()">
      <p><aegis-severity-badge severity="CRITICAL" noteHtml="seen <b>42</b> times" /></p>
      <p><aegis-severity-badge class="compact" severity="HIGH" /></p>
      <p><aegis-shadow-badge /></p>
      <p><span class="aegis-visually-hidden">only screen readers see this</span>Visually hidden text is in the line above.</p>
    </section>
  `,
})
export class Page {
  readonly dark = signal(true);
}

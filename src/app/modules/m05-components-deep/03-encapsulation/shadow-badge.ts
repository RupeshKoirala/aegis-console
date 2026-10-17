import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'aegis-shadow-badge',
  // TODO 4: render this component inside a real Shadow DOM:  encapsulation: ViewEncapsulation.ShadowDom
  template: `<span class="badge">shadow DOM</span>`,
  styles: `.badge { padding: 2px 8px; border-radius: 6px; border: 1px solid var(--accent-2); font-size: 12px; }`,
})
export class ShadowBadge {}

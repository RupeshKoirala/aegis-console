import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { Decision } from '../../../shared/domain/models';

/**
 * Done for you: a normal Angular component. M19 turns it into <aegis-verdict>, a custom element that
 * ANY web page can use (a partner portal, the docs site, a WordPress plugin), with no Angular knowledge needed.
 * ShadowDom keeps its CSS in and the host page's CSS out.
 */
@Component({
  selector: 'aegis-verdict-badge',
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <span class="pill" [class]="verdict().toLowerCase()">
      <b>{{ verdict() }}</b> <code>{{ value() }}</code>
      <button type="button" (click)="details.emit({ value: value(), verdict: verdict() })">why?</button>
    </span>`,
  styles: `
    .pill { font: 13px system-ui; display: inline-flex; gap: 6px; align-items: center; padding: 3px 10px; border-radius: 999px; border: 1px solid; }
    .block { color: #b42318; border-color: #b42318; background: #fef3f2; }
    .allow { color: #067647; border-color: #067647; background: #ecfdf3; }
    .none { color: #475467; border-color: #98a2b3; background: #f9fafb; }
    button { font: inherit; border: 0; background: none; text-decoration: underline; cursor: pointer; color: inherit; }`,
})
export class VerdictBadge {
  readonly value = input('');
  readonly verdict = input<Decision>('NONE');
  readonly details = output<{ value: string; verdict: Decision }>();
}

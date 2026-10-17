import { Component, booleanAttribute, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'danger' | 'ghost';

@Component({
//@@sol
  selector: 'button[aegisBtn]',
  host: {
    class: 'aegis-btn',
    '[attr.data-variant]': 'variant()',
    '[attr.aria-busy]': 'busy()',
    '(click)': 'guard($event)',
  },
//@@stub
  // TODO 1: an ATTRIBUTE selector so this component enhances a native button:  'button[aegisBtn]'
  selector: 'aegis-btn-todo',
  // TODO 2: host metadata:
  //   class: 'aegis-btn'                        (static class)
  //   '[attr.data-variant]': 'variant()'
  //   '[attr.aria-busy]': 'busy()'
  //   '(click)': 'guard($event)'
//@@end
  template: `
    @if (busy()) { <span class="spinner" aria-hidden="true"></span> }
    <ng-content />
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 8px; }
    :host([data-variant='primary']) { background: var(--accent); border-color: var(--accent); color: #fff; }
    :host([data-variant='danger']) { border-color: var(--block); color: #fca5a5; }
    :host([aria-busy='true']) { opacity: .7; cursor: progress; }
    .spinner { width: 12px; height: 12px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class AegisButton {
  readonly variant = input<ButtonVariant>('ghost');
  readonly busy = input(false, { transform: booleanAttribute });

  guard(event: Event) {
//@@sol
    if (this.busy()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
//@@stub
    // TODO 3: while busy(), swallow the click so the consumer's (click) handler never runs:
    //         event.preventDefault() + event.stopImmediatePropagation()
//@@end
  }
}

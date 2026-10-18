import { Component, ElementRef, Injector, inject, input, output, signal, viewChild, viewChildren, afterNextRender } from '@angular/core';
import { ActiveDescendantKeyManager, CdkTrapFocus, LiveAnnouncer } from '@angular/cdk/a11y';
import { Alert } from '../../../shared/domain/models';
import { AlertOption } from './alert-option';

/**
 * The alert queue, usable WITHOUT a mouse (keyboard-only analysts, screen-reader users, and anyone on a
 * 3-monitor SOC desk who lives on the keyboard):
 *   ↑/↓ move, Home/End jump, Enter opens "resolve?" confirm, Escape closes it.
 */
@Component({
  selector: 'aegis-alert-queue',
  imports: [AlertOption, CdkTrapFocus],
  template: `
    <div #list class="listbox" role="listbox" tabindex="0" aria-label="Alert queue"
         [attr.aria-activedescendant]="activeId()" (keydown)="onKeydown($event)">
      @for (a of alerts(); track a.id) { <aegis-alert-option [alert]="a" (click)="pick($index)" /> }
    </div>

    @if (confirming(); as a) {
      <div class="backdrop">
<!--@@sol-->
        <div class="dialog card" role="dialog" aria-modal="true" aria-labelledby="confirm-title" cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
             (keydown.escape)="cancel()">
<!--@@stub-->
        <!-- TODO 4: a real modal dialog: role="dialog" aria-modal="true" aria-labelledby="confirm-title",
             trap focus inside it (cdkTrapFocus [cdkTrapFocusAutoCapture]="true"), and close on Escape: (keydown.escape)="cancel()" -->
        <div class="dialog card">
<!--@@end-->
          <h3 id="confirm-title">Resolve "{{ a.title }}"?</h3>
          <div class="row"><button class="primary yes" (click)="confirm()">Resolve</button> <button class="no" (click)="cancel()">Cancel</button></div>
        </div>
      </div>
    }
  `,
  styles: `.listbox { display: grid; gap: 2px; padding: 6px; border: 1px solid var(--border); border-radius: 10px; }
    .listbox:focus-visible { outline: 2px solid var(--accent); }
    .backdrop { position: fixed; inset: 0; background: rgb(0 0 0 / .5); display: grid; place-items: center; }`,
})
export class AlertQueue {
  readonly alerts = input.required<Alert[]>();
  readonly resolve = output<Alert>();
  private readonly options = viewChildren(AlertOption);
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly announcer = inject(LiveAnnouncer);
  private readonly injector = inject(Injector);
  readonly confirming = signal<Alert | null>(null);
  readonly activeId = signal<string | null>(null);
  private keys!: ActiveDescendantKeyManager<AlertOption>;

  constructor() {
    afterNextRender(() => {
//@@sol
      this.keys = new ActiveDescendantKeyManager(this.options, this.injector).withWrap().withHomeAndEnd();
      this.keys.change.subscribe(() => this.activeId.set(this.keys.activeItem ? `alert-opt-${this.keys.activeItem.alert().id}` : null));
      this.keys.setFirstItemActive();
//@@stub
      // TODO 1: the key manager does ↑/↓/Home/End and tells each option when it's active:
      //   this.keys = new ActiveDescendantKeyManager(this.options, this.injector).withWrap().withHomeAndEnd();
      //   (given a SIGNAL of items, the manager needs an injector to watch it)
      //   on this.keys.change → activeId.set('alert-opt-' + activeItem.alert().id)   (screen readers read the
      //   aria-activedescendant option while focus stays on the listbox); then setFirstItemActive()
      this.keys = { onKeydown: () => {}, activeItem: null, setActiveItem: () => {} } as unknown as ActiveDescendantKeyManager<AlertOption>;
//@@end
    });
  }

  onKeydown(event: KeyboardEvent) {
//@@sol
    if (event.key === 'Enter' && this.keys.activeItem) {
      event.preventDefault();
      this.confirming.set(this.keys.activeItem.alert());
      return;
    }
    this.keys.onKeydown(event);
//@@stub
    // TODO 2: Enter on the active option → confirming.set(its alert) (preventDefault); any other key → this.keys.onKeydown(event)
//@@end
  }

  pick(index: number) {
    this.keys.setActiveItem(index);
    this.list().nativeElement.focus();
  }

  confirm() {
    const a = this.confirming();
    if (!a) return;
    this.resolve.emit(a);
//@@sol
    this.announcer.announce(`Alert resolved: ${a.title}`, 'polite');
//@@stub
    // TODO 3: tell screen-reader users what happened (the change is visual only otherwise):
    //         this.announcer.announce(`Alert resolved: ${a.title}`, 'polite')
//@@end
    this.close();
  }

  cancel() {
    this.close();
  }

  /** TODO 5 (done for you, study it): closing a dialog must RETURN focus to where the user was. */
  private close() {
    this.confirming.set(null);
    this.list().nativeElement.focus();
  }
}

import { DestroyRef, Directive, inject, input, signal } from '@angular/core';

@Directive({
  selector: '[aegisCopy]',
  exportAs: 'aegisCopy',
  host: { '(click)': 'copy()' },
})
export class CopyDirective {
  readonly value = input.required<string>({ alias: 'aegisCopy' });
  readonly copied = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  copy() {
    navigator.clipboard?.writeText(this.value()).catch(() => {});
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), 2000);
  }
}

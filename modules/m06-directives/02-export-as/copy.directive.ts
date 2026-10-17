//@@sol
import { DestroyRef, Directive, inject, input, signal } from '@angular/core';
//@@stub
import { Directive, input, signal } from '@angular/core';
//@@end

@Directive({
  selector: '[aegisCopy]',
//@@sol
  exportAs: 'aegisCopy',
  host: { '(click)': 'copy()' },
//@@stub
  // TODO 1: exportAs: 'aegisCopy'   and   host: { '(click)': 'copy()' }
//@@end
})
export class CopyDirective {
  readonly value = input.required<string>({ alias: 'aegisCopy' });
  readonly copied = signal(false);
  private timer?: ReturnType<typeof setTimeout>;
//@@sol

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  copy() {
    navigator.clipboard?.writeText(this.value()).catch(() => {});
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), 2000);
  }
//@@stub

  copy() {
    // TODO 2: write value() to navigator.clipboard (with .catch), set copied to true,
    //         and reset it to false after 2000 ms (restart the timer if clicked again)
  }

  // TODO 3: clear the timer when the directive is destroyed: inject(DestroyRef).onDestroy(...)
//@@end
}

import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[aegisCopy]',
  // TODO 1: exportAs: 'aegisCopy'   and   host: { '(click)': 'copy()' }
})
export class CopyDirective {
  readonly value = input.required<string>({ alias: 'aegisCopy' });
  readonly copied = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  copy() {
    // TODO 2: write value() to navigator.clipboard (with .catch), set copied to true,
    //         and reset it to false after 2000 ms (restart the timer if clicked again)
  }

  // TODO 3: clear the timer when the directive is destroyed: inject(DestroyRef).onDestroy(...)
}

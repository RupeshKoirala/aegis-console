import { Directive, output } from '@angular/core';

@Directive({
  selector: '[aegisFocusable]',
  host: { tabindex: '0', class: 'focusable', '(keydown.enter)': 'activate()', '(keydown.space)': 'activate()' },
})
export class Focusable {
  readonly activated = output<void>();
  activate() {
    this.activated.emit();
  }
}

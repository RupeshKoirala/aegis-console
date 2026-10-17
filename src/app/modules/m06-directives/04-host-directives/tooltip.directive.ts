import { Directive, input } from '@angular/core';

@Directive({
  selector: '[aegisTooltip]',
  host: { '[attr.title]': 'aegisTooltip()', '[attr.aria-label]': 'aegisTooltip()' },
})
export class Tooltip {
  readonly aegisTooltip = input('');
}

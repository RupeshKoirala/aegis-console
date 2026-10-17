import { computed, input } from '@angular/core';
import { Severity } from '../../../shared/domain/models';

// TODO 1: make this a directive:
//   @Directive({ selector: '[aegisSeverity]',
//                host: { '[style.border-left]': 'edge()', '[attr.title]': '"Severity: " + severity()' } })
export class SeverityHighlight {
  // TODO 2: the input is named after the selector so <tr [aegisSeverity]="…"> works:
  //         input.required<Severity>({ alias: 'aegisSeverity' })
  readonly severity = (() => 'INFO') as () => Severity;
  readonly edge = computed(() => `4px solid var(--${this.severity().toLowerCase()})`);

  // TODO 3: inject ElementRef<HTMLElement> and Renderer2
  // TODO 4: in the constructor, an effect(): when severity() is 'CRITICAL' add the class "pulse" to the host
  //         element with renderer.addClass(...), otherwise renderer.removeClass(...)
}

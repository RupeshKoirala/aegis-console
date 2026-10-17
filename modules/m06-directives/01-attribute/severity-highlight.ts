//@@sol
import { Directive, ElementRef, Renderer2, computed, effect, inject, input } from '@angular/core';
//@@stub
import { computed, input } from '@angular/core';
//@@end
import { Severity } from '../../../shared/domain/models';

//@@sol
@Directive({
  selector: '[aegisSeverity]',
  host: {
    '[style.border-left]': 'edge()',
    '[attr.title]': '"Severity: " + severity()',
  },
})
//@@stub
// TODO 1: make this a directive:
//   @Directive({ selector: '[aegisSeverity]',
//                host: { '[style.border-left]': 'edge()', '[attr.title]': '"Severity: " + severity()' } })
//@@end
export class SeverityHighlight {
//@@sol
  readonly severity = input.required<Severity>({ alias: 'aegisSeverity' });
//@@stub
  // TODO 2: the input is named after the selector so <tr [aegisSeverity]="…"> works:
  //         input.required<Severity>({ alias: 'aegisSeverity' })
  readonly severity = (() => 'INFO') as () => Severity;
//@@end
  readonly edge = computed(() => `4px solid var(--${this.severity().toLowerCase()})`);
//@@sol
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      if (this.severity() === 'CRITICAL') this.renderer.addClass(this.el.nativeElement, 'pulse');
      else this.renderer.removeClass(this.el.nativeElement, 'pulse');
    });
  }
//@@stub

  // TODO 3: inject ElementRef<HTMLElement> and Renderer2
  // TODO 4: in the constructor, an effect(): when severity() is 'CRITICAL' add the class "pulse" to the host
  //         element with renderer.addClass(...), otherwise renderer.removeClass(...)
//@@end
}

import { Directive, ElementRef, Renderer2, computed, effect, inject, input } from '@angular/core';
import { Severity } from '../../../shared/domain/models';

@Directive({
  selector: '[aegisSeverity]',
  host: {
    '[style.border-left]': 'edge()',
    '[attr.title]': '"Severity: " + severity()',
  },
})
export class SeverityHighlight {
  readonly severity = input.required<Severity>({ alias: 'aegisSeverity' });
  readonly edge = computed(() => `4px solid var(--${this.severity().toLowerCase()})`);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      if (this.severity() === 'CRITICAL') this.renderer.addClass(this.el.nativeElement, 'pulse');
      else this.renderer.removeClass(this.el.nativeElement, 'pulse');
    });
  }
}

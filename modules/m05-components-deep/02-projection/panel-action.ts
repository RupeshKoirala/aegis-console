import { Directive, input } from '@angular/core';

/** Marks a projected button as a panel action:  <button panelAction="refresh">. */
@Directive({ selector: '[panelAction]' })
export class PanelAction {
  readonly panelAction = input.required<string>();
}

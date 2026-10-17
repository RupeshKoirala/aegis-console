import { Component, computed, input } from '@angular/core';
import { PanelAction } from './panel-action';

@Component({
  selector: 'aegis-panel',
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  readonly tone = input<'default' | 'danger'>('default');
  // TODO 3: query every projected PanelAction (also nested ones):  contentChildren(PanelAction, { descendants: true })
  //         then make actionNames a computed of their panelAction() values
  readonly actionNames = computed(() => [] as string[]);
}

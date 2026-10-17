import { Component, computed, contentChildren, input } from '@angular/core';
import { PanelAction } from './panel-action';

@Component({
  selector: 'aegis-panel',
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  readonly tone = input<'default' | 'danger'>('default');
  readonly actions = contentChildren(PanelAction, { descendants: true });
  readonly actionNames = computed(() => this.actions().map(a => a.panelAction()));
}

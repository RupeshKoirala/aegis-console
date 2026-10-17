import { Component } from '@angular/core';
import { Panel } from './panel';
import { PanelAction } from './panel-action';
import { LegacyPanel } from './legacy-panel';

@Component({
  selector: 'app-m05-02',
  imports: [Panel, PanelAction, LegacyPanel],
  templateUrl: './page.html',
  styles: `.panels { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; } h3 { margin: 0; font-size: 15px; }`,
})
export class Page {}

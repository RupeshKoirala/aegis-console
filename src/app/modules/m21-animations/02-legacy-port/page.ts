import { Component } from '@angular/core';
import { LegacyPanel } from './legacy-panel';
import { ModernPanel } from './modern-panel';

@Component({
  selector: 'app-m21-02',
  imports: [LegacyPanel, ModernPanel],
  template: `
    <h1>Port a legacy animation <small class="muted">@angular/animations → CSS</small></h1>
    <div class="cols">
      <section class="card"><h3>Legacy (Gen 1/2)</h3>
        <aegis-legacy-panel title="Indicator details"><p>203.0.113.66 · Botnets · score 97 · first seen 3 days ago</p></aegis-legacy-panel>
      </section>
      <section class="card"><h3>Your port (Gen 3)</h3>
        <aegis-modern-panel title="Indicator details"><p>203.0.113.66 · Botnets · score 97 · first seen 3 days ago</p></aegis-modern-panel>
      </section>
    </div>
  `,
  styles: `.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }`,
})
export class Page {}

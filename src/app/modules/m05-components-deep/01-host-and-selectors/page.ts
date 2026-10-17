import { Component, signal } from '@angular/core';
import { StatTile } from './stat-tile';
import { LegacyStatTile } from './legacy-stat-tile';

@Component({
  selector: 'app-m05-01',
  imports: [StatTile, LegacyStatTile], // AegisButton gets added in TODO 6
  template: `
    <h1>Widget kit: buttons & tiles</h1>
    <div class="grid tiles">
      <aegis-stat-tile label="Blocked today" [value]="1284" [limit]="5000" />
      <aegis-stat-tile label="Entries on appliance" [value]="912000" [limit]="800000" />
      <aegis-legacy-stat-tile label="Open alerts (Gen 1)" [value]="4" [limit]="3" />
    </div>
    <div class="row actions">
      <!-- TODO 6: after TODO 1–3, import AegisButton and turn these into enhanced native buttons:
           <button aegisBtn variant="primary" class="save" (click)="saves.set(saves() + 1)">Save list</button>
           <button aegisBtn variant="danger" class="busy" busy (click)="saves.set(saves() + 100)">Deleting…</button> -->
      <button class="save" (click)="saves.set(saves() + 1)">Save list</button>
      <span class="muted saves">saves: {{ saves() }}</span>
    </div>
  `,
  styles: `.tiles { margin-bottom: 20px; }`,
})
export class Page {
  readonly saves = signal(0);
}

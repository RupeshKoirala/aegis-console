import { Component, signal } from '@angular/core';
import { AegisButton } from './aegis-button';
import { StatTile } from './stat-tile';
import { LegacyStatTile } from './legacy-stat-tile';

@Component({
  selector: 'app-m05-01',
  imports: [AegisButton, StatTile, LegacyStatTile],
  template: `
    <h1>Widget kit: buttons & tiles</h1>
    <div class="grid tiles">
      <aegis-stat-tile label="Blocked today" [value]="1284" [limit]="5000" />
      <aegis-stat-tile label="Entries on appliance" [value]="912000" [limit]="800000" />
      <aegis-legacy-stat-tile label="Open alerts (Gen 1)" [value]="4" [limit]="3" />
    </div>
    <div class="row actions">
      <button aegisBtn variant="primary" class="save" (click)="saves.set(saves() + 1)">Save list</button>
      <button aegisBtn variant="danger" class="busy" busy (click)="saves.set(saves() + 100)">Deleting…</button>
      <span class="muted saves">saves: {{ saves() }}</span>
    </div>
  `,
  styles: `.tiles { margin-bottom: 20px; }`,
})
export class Page {
  readonly saves = signal(0);
}

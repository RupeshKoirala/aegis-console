import { Component, signal } from '@angular/core';
import { IndicatorTable } from '../indicator-table';
import { INDICATORS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-m22-02',
  imports: [IndicatorTable],
  template: `
    <h1>Component harnesses <small class="muted">@angular/cdk/testing</small></h1>
    <div class="cols">
      <section class="card"><h3>Manual blocks</h3><aegis-indicator-table [rows]="blocks()" [canDelete]="true" (remove)="drop(blocks, $event)" /></section>
      <section class="card"><h3>Threat feed (read-only)</h3><aegis-indicator-table [rows]="threats" /></section>
    </div>
  `,
  styles: `.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }`,
})
export class Page {
  readonly blocks = signal(INDICATORS.filter(i => i.listId === 2));
  protected readonly threats = INDICATORS.filter(i => i.listId === 3);
  drop(list: typeof this.blocks, id: number) {
    list.update(l => l.filter(i => i.id !== id));
  }
}

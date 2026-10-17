import { Component, inject, signal } from '@angular/core';
//@@sol
import { ENRICHERS, asnEnricher, geoEnricher, reputationEnricher, Enrichment } from './enrichers';
//@@stub
import { Enrichment } from './enrichers';
//@@end
import { EnrichmentService } from './enrichment.service';

@Component({
  selector: 'app-m08-04',
//@@sol
  providers: [
    { provide: ENRICHERS, useValue: geoEnricher, multi: true },
    { provide: ENRICHERS, useValue: asnEnricher, multi: true },
    { provide: ENRICHERS, useValue: reputationEnricher, multi: true },
  ],
//@@stub
  // TODO 1: register geoEnricher, asnEnricher and reputationEnricher on the ENRICHERS token with multi: true
  providers: [],
//@@end
  template: `
    <h1>Enrich an indicator</h1>
    <button class="enrich" (click)="run('203.0.113.66')">Enrich 203.0.113.66</button>
    <ul class="card results">@for (r of results(); track r.source) { <li><strong>{{ r.source }}</strong>: {{ r.text }}</li> }</ul>
  `,
})
export class Page {
  private readonly service = inject(EnrichmentService);
  readonly results = signal<Enrichment[]>([]);
  run(value: string) {
    this.results.set(this.service.enrich(value));
  }
}

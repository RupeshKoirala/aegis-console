import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { ENRICHERS, Enrichment } from './enrichers';

@Injectable({ providedIn: 'root' })
export class EnrichmentService {
  private readonly injector = inject(Injector);

  enrich(value: string): Enrichment[] {
    return runInInjectionContext(this.injector, () => {
      const enrichers = inject(ENRICHERS, { optional: true }) ?? [];
      return enrichers.map(e => e(value));
    });
  }
}

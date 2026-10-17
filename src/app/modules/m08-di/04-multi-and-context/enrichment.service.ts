import { Injectable } from '@angular/core';
import { ENRICHERS, Enrichment } from './enrichers';

@Injectable({ providedIn: 'root' })
export class EnrichmentService {
  // TODO 2: capture the Injector at construction time (inject(Injector))

  enrich(value: string): Enrichment[] {
    // TODO 3: inject(ENRICHERS) here would throw NG0203 (we're outside an injection context: this runs on click).
    //         Wrap it:  runInInjectionContext(this.injector, () => inject(ENRICHERS, { optional: true }) ?? [])
    //         then run every enricher on the value.
    return [];
  }
}

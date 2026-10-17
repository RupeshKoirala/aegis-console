//@@sol
import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
//@@stub
import { Injectable } from '@angular/core';
//@@end
import { ENRICHERS, Enrichment } from './enrichers';

@Injectable({ providedIn: 'root' })
export class EnrichmentService {
//@@sol
  private readonly injector = inject(Injector);

  enrich(value: string): Enrichment[] {
    return runInInjectionContext(this.injector, () => {
      const enrichers = inject(ENRICHERS, { optional: true }) ?? [];
      return enrichers.map(e => e(value));
    });
  }
//@@stub
  // TODO 2: capture the Injector at construction time (inject(Injector))

  enrich(value: string): Enrichment[] {
    // TODO 3: inject(ENRICHERS) here would throw NG0203 (we're outside an injection context: this runs on click).
    //         Wrap it:  runInInjectionContext(this.injector, () => inject(ENRICHERS, { optional: true }) ?? [])
    //         then run every enricher on the value.
    return [];
  }
//@@end
}

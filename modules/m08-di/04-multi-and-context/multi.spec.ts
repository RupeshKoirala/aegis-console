import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { EnrichmentService } from './enrichment.service';
import { ENRICHERS, geoEnricher } from './enrichers';

describe('M08.04 · multi providers & injection context', () => {
  it('TODO 2–3: the service runs every registered enricher, outside a constructor', () => {
    TestBed.configureTestingModule({ providers: [{ provide: ENRICHERS, useValue: geoEnricher, multi: true }] });
    const s = TestBed.inject(EnrichmentService);
    expect(s.enrich('203.0.113.66')).toEqual([{ source: 'geo', text: 'AU · Sydney' }]);
  });

  it('TODO 1: the page registers three enrichers (in order)', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const list = f.debugElement.injector.get(ENRICHERS);
    expect(list.length).toBe(3);
  });
});

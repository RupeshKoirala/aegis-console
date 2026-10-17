import { InjectionToken } from '@angular/core';

export interface Enrichment { source: string; text: string; }
export type Enricher = (value: string) => Enrichment;

export const ENRICHERS = new InjectionToken<Enricher[]>('aegis.enrichers');

export const geoEnricher: Enricher = v => ({ source: 'geo', text: v.startsWith('203.') ? 'AU · Sydney' : 'unknown' });
export const asnEnricher: Enricher = v => ({ source: 'asn', text: v.startsWith('203.') ? 'AS64500 Example Hosting' : 'AS0' });
export const reputationEnricher: Enricher = v => ({ source: 'reputation', text: v.includes('66') ? 'known botnet C2' : 'no history' });

import { InjectionToken } from '@angular/core';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export interface RiskThresholds { medium: number; high: number }
export interface TenantRisk { id: string; name: string; score: number }

/** Default thresholds for every gauge. A component can override them with its own provider (M08 explains how). */
export const RISK_THRESHOLDS = new InjectionToken<RiskThresholds>('RISK_THRESHOLDS', {
  factory: () => ({ medium: 40, high: 80 }),
});

export function levelFor(score: number, t: RiskThresholds): RiskLevel {
  if (score >= t.high) return 'HIGH';
  if (score >= t.medium) return 'MEDIUM';
  return 'LOW';
}

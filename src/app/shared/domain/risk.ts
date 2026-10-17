import { Severity } from './models';

/** Same rule you wrote in M00.01, provided here so later modules don't depend on your exercise code. */
export function riskLevel(score: number | null): Severity {
  if (score === null) return 'INFO';
  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

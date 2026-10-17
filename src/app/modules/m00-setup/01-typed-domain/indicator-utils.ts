import { IndicatorType, IndicatorView, Severity } from '../../../shared/domain/models';

const OCTET = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
/** Matches a dotted IPv4 address such as 203.0.113.7 (provided for you). */
export const IPV4 = new RegExp(`^${OCTET}(\\.${OCTET}){3}$`);
/** Matches a domain such as evil.example or www.login-micr0soft.example (provided for you). */
export const DOMAIN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export function classify(value: string): IndicatorType | null {
  const v = value.trim().toLowerCase();
  if (IPV4.test(v)) return 'IP';
  const [ip, bits, ...rest] = v.split('/');
  if (rest.length === 0 && bits !== undefined && IPV4.test(ip) && /^\d{1,2}$/.test(bits) && Number(bits) <= 32) return 'CIDR';
  if (DOMAIN.test(v)) return 'DOMAIN';
  return null;
}

export function riskLevel(score: number | null): Severity {
  if (score === null) return 'INFO';
  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

export function isExpired(indicator: Pick<IndicatorView, 'expiresAt'>, now: Date = new Date()): boolean {
  return indicator.expiresAt !== null && Date.parse(indicator.expiresAt) < now.getTime();
}

export function groupBy<T, K extends PropertyKey>(items: readonly T[], key: (item: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of items) {
    (out[key(item)] ??= []).push(item);
  }
  return out;
}

export function label(indicator: IndicatorView): string {
  const base = `${indicator.value} (${indicator.type})`;
  return indicator.category && indicator.score !== null ? `${base} · ${indicator.category} ${indicator.score}` : base;
}

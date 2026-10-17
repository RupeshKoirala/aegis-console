import { IndicatorType, IndicatorView, Severity } from '../../../shared/domain/models';

const OCTET = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
/** Matches a dotted IPv4 address such as 203.0.113.7 (provided for you). */
export const IPV4 = new RegExp(`^${OCTET}(\\.${OCTET}){3}$`);
/** Matches a domain such as evil.example or www.login-micr0soft.example (provided for you). */
export const DOMAIN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export function classify(value: string): IndicatorType | null {
//@@sol
  const v = value.trim().toLowerCase();
  if (IPV4.test(v)) return 'IP';
  const [ip, bits, ...rest] = v.split('/');
  if (rest.length === 0 && bits !== undefined && IPV4.test(ip) && /^\d{1,2}$/.test(bits) && Number(bits) <= 32) return 'CIDR';
  if (DOMAIN.test(v)) return 'DOMAIN';
  return null;
//@@stub
  // TODO 1: trim + lower-case, then return 'IP' | 'CIDR' | 'DOMAIN' | null
  //   - 'IP'     → IPV4.test(v)
  //   - 'CIDR'   → split on '/', the left part is an IPv4 and the right part is a whole number 0..32
  //   - 'DOMAIN' → DOMAIN.test(v)
  return null;
//@@end
}

export function riskLevel(score: number | null): Severity {
//@@sol
  if (score === null) return 'INFO';
  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
//@@stub
  // TODO 2: null → 'INFO', ≥90 'CRITICAL', ≥70 'HIGH', ≥40 'MEDIUM', else 'LOW'
  return 'INFO';
//@@end
}

export function isExpired(indicator: Pick<IndicatorView, 'expiresAt'>, now: Date = new Date()): boolean {
//@@sol
  return indicator.expiresAt !== null && Date.parse(indicator.expiresAt) < now.getTime();
//@@stub
  // TODO 3: true only when expiresAt is set AND earlier than `now`
  return false;
//@@end
}

//@@sol
export function groupBy<T, K extends PropertyKey>(items: readonly T[], key: (item: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of items) {
    (out[key(item)] ??= []).push(item);
  }
  return out;
}
//@@stub
// TODO 4: make this generic:  groupBy<T, K extends PropertyKey>(items: readonly T[], key: (item: T) => K): Record<K, T[]>
//         Build a new object; never mutate `items`.
export function groupBy(items: readonly any[], key: (item: any) => PropertyKey): Record<PropertyKey, any[]> {
  return {};
}
//@@end

export function label(indicator: IndicatorView): string {
//@@sol
  const base = `${indicator.value} (${indicator.type})`;
  return indicator.category && indicator.score !== null ? `${base} · ${indicator.category} ${indicator.score}` : base;
//@@stub
  // TODO 5: "203.0.113.66 (IP) · Botnets 97" when category and score are set, otherwise "evil.example (DOMAIN)"
  return indicator.value;
//@@end
}

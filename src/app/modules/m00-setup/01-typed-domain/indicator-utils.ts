import { IndicatorType, IndicatorView, Severity } from '../../../shared/domain/models';

const OCTET = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
/** Matches a dotted IPv4 address such as 203.0.113.7 (provided for you). */
export const IPV4 = new RegExp(`^${OCTET}(\\.${OCTET}){3}$`);
/** Matches a domain such as evil.example or www.login-micr0soft.example (provided for you). */
export const DOMAIN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export function classify(value: string): IndicatorType | null {
  // TODO 1: trim + lower-case, then return 'IP' | 'CIDR' | 'DOMAIN' | null
  //   - 'IP'     → IPV4.test(v)
  //   - 'CIDR'   → split on '/', the left part is an IPv4 and the right part is a whole number 0..32
  //   - 'DOMAIN' → DOMAIN.test(v)
  return null;
}

export function riskLevel(score: number | null): Severity {
  // TODO 2: null → 'INFO', ≥90 'CRITICAL', ≥70 'HIGH', ≥40 'MEDIUM', else 'LOW'
  return 'INFO';
}

export function isExpired(indicator: Pick<IndicatorView, 'expiresAt'>, now: Date = new Date()): boolean {
  // TODO 3: true only when expiresAt is set AND earlier than `now`
  return false;
}

// TODO 4: make this generic:  groupBy<T, K extends PropertyKey>(items: readonly T[], key: (item: T) => K): Record<K, T[]>
//         Build a new object; never mutate `items`.
export function groupBy(items: readonly any[], key: (item: any) => PropertyKey): Record<PropertyKey, any[]> {
  return {};
}

export function label(indicator: IndicatorView): string {
  // TODO 5: "203.0.113.66 (IP) · Botnets 97" when category and score are set, otherwise "evil.example (DOMAIN)"
  return indicator.value;
}

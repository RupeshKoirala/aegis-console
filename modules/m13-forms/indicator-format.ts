// Done for you: the same classification rules as the API (api/server.cjs → classify).
import { IndicatorType } from '../../shared/domain/models';

const OCTET = '(25[0-5]|2[0-4]\\d|1?\\d?\\d)';
export const IPV4 = new RegExp(`^${OCTET}(\\.${OCTET}){3}$`);
const DOMAIN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

/** For the template `pattern` attribute: IPv4, IPv4/0-32 or a domain. Angular anchors it with ^…$. */
export const INDICATOR_PATTERN =
  `${OCTET}(\\.${OCTET}){3}(\\/(3[0-2]|[12]?\\d))?|([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,63}`;

export function classify(raw: string | null | undefined): IndicatorType | null {
  const v = (raw ?? '').trim().toLowerCase();
  if (IPV4.test(v)) return 'IP';
  const [ip, bits] = v.split('/');
  if (bits !== undefined && IPV4.test(ip) && /^\d+$/.test(bits) && +bits <= 32) return 'CIDR';
  if (DOMAIN.test(v)) return 'DOMAIN';
  return null;
}

export const THREAT_CATEGORIES = ['Botnets', 'Phishing', 'Malware Sites', 'Scanners', 'Brute Force', 'Spam Sources', 'TOR Proxy', 'Spyware'];

// Static sample data for the modules that run before we talk to the API (M01–M11).
// Same values as the fake API seed, so screens look identical later.
import { Alert, IndicatorView, ListView, TenantView } from './models';

export const TENANT: TenantView = { id: 1, name: 'Acme Schools', slug: 'acme', parentId: 3, createdAt: '2025-09-12T08:00:00Z' };

export const LISTS: ListView[] = [
  { id: 1, name: 'Partner allow list', kind: 'ALLOW', description: 'Vendors we must never block', indicatorCount: 2, createdAt: '2026-07-19T10:00:00Z' },
  { id: 2, name: 'Manual blocks', kind: 'BLOCK', description: 'Added by the SOC during incidents', indicatorCount: 4, createdAt: '2026-07-20T10:00:00Z' },
  { id: 3, name: 'Webroot sample', kind: 'THREAT', description: 'Scored threat intelligence feed', indicatorCount: 11, createdAt: '2026-07-21T10:00:00Z' },
  { id: 5, name: 'CINS army', kind: 'BLOCK', description: 'Community feed of attacking hosts', indicatorCount: 2, createdAt: '2026-07-23T10:00:00Z' },
];

const base = { description: null, expiresAt: null, source: 'manual', category: null, score: null } as const;
const at = (h: number) => new Date(Date.UTC(2026, 9, 15, 12) - h * 3_600_000).toISOString();

export const INDICATORS: IndicatorView[] = [
  { ...base, id: 1, listId: 1, value: '192.0.2.10', type: 'IP', description: 'Payroll provider', createdAt: at(50) },
  { ...base, id: 2, listId: 1, value: 'partner.example', type: 'DOMAIN', createdAt: at(49) },
  { ...base, id: 3, listId: 2, value: '203.0.113.7', type: 'IP', description: 'Phishing landing page', createdAt: at(48) },
  { ...base, id: 4, listId: 2, value: '198.51.100.0/24', type: 'CIDR', description: 'Hosting range used in incident #42', createdAt: at(47) },
  { ...base, id: 5, listId: 2, value: 'evil.example', type: 'DOMAIN', createdAt: at(46) },
  { ...base, id: 6, listId: 2, value: 'malware-cdn.example', type: 'DOMAIN', expiresAt: '2026-10-22T12:00:00Z', createdAt: at(45) },
  { ...base, id: 7, listId: 3, value: '203.0.113.66', type: 'IP', category: 'Botnets', score: 97, source: 'webroot', createdAt: at(44) },
  { ...base, id: 8, listId: 3, value: '192.0.2.200', type: 'IP', category: 'Scanners', score: 64, source: 'webroot', createdAt: at(43) },
  { ...base, id: 9, listId: 3, value: '203.0.113.120', type: 'IP', category: 'Phishing', score: 92, source: 'webroot', createdAt: at(42) },
  { ...base, id: 10, listId: 3, value: '198.18.0.0/15', type: 'CIDR', category: 'Spam Sources', score: 75, source: 'webroot', createdAt: at(41) },
  { ...base, id: 11, listId: 3, value: '203.0.113.250', type: 'IP', category: 'TOR Proxy', score: 55, source: 'webroot', createdAt: at(40) },
  { ...base, id: 12, listId: 3, value: 'crypto-miner.example', type: 'DOMAIN', category: 'Malware Sites', score: 99, source: 'webroot', createdAt: at(39) },
  { ...base, id: 13, listId: 3, value: 'login-micr0soft.example', type: 'DOMAIN', category: 'Phishing', score: 95, source: 'webroot', createdAt: at(38) },
  { ...base, id: 14, listId: 3, value: '192.0.2.77', type: 'IP', category: 'Windows Exploits', score: 88, source: 'webroot', createdAt: at(37) },
  { ...base, id: 15, listId: 3, value: '203.0.113.45', type: 'IP', category: 'Brute Force', score: 91, source: 'webroot', createdAt: at(36) },
  { ...base, id: 16, listId: 3, value: '203.0.113.46', type: 'IP', category: 'Brute Force', score: 82, source: 'webroot', createdAt: at(35) },
  { ...base, id: 17, listId: 3, value: 'stats-tracker.example', type: 'DOMAIN', category: 'Spyware', score: 70, source: 'webroot', createdAt: at(34) },
  { ...base, id: 20, listId: 5, value: '192.0.2.128/25', type: 'CIDR', source: 'cins', createdAt: at(31) },
  { ...base, id: 21, listId: 5, value: '203.0.113.180', type: 'IP', source: 'cins', createdAt: at(30) },
];

export const listOf = (indicator: IndicatorView): ListView => LISTS.find(l => l.id === indicator.listId)!;


export const ALERTS: Alert[] = [
  { id: 1, tenantId: 1, eventId: 3, at: '2026-10-15T11:40:00Z', severity: 'CRITICAL', title: 'Blocked traffic to 203.0.113.66 (Botnets)', status: 'NEW', assignee: null },
  { id: 2, tenantId: 1, eventId: 8, at: '2026-10-15T11:05:00Z', severity: 'CRITICAL', title: 'Blocked DNS lookup of crypto-miner.example', status: 'TRIAGED', assignee: 'analyst@acme.test' },
  { id: 3, tenantId: 1, eventId: 12, at: '2026-10-15T10:31:00Z', severity: 'HIGH', title: 'Repeated hits on 192.0.2.77 (Windows Exploits)', status: 'NEW', assignee: null },
  { id: 4, tenantId: 1, eventId: 17, at: '2026-10-15T09:58:00Z', severity: 'HIGH', title: 'Blocked traffic to 203.0.113.46 (Brute Force)', status: 'RESOLVED', assignee: 'admin@acme.test' },
  { id: 5, tenantId: 1, eventId: 21, at: '2026-10-15T09:12:00Z', severity: 'CRITICAL', title: 'Phishing domain login-micr0soft.example blocked', status: 'NEW', assignee: null },
  { id: 6, tenantId: 1, eventId: 25, at: '2026-10-15T08:44:00Z', severity: 'HIGH', title: 'Spam source range 198.18.0.0/15 contacted', status: 'RESOLVED', assignee: 'analyst@acme.test' },
];

// Seed data for the fake Aegis API. Edit freely; `npm run api:reset` rebuilds db.json from this file.
const now = Date.now();
const iso = (msAgo) => new Date(now - msAgo).toISOString();
const DAY = 86_400_000;

const tenants = [
  { id: 1, name: 'Acme Schools', slug: 'acme', parentId: 3, createdAt: iso(400 * DAY) },
  { id: 2, name: 'Globex Health', slug: 'globex', parentId: 3, createdAt: iso(300 * DAY) },
  { id: 3, name: 'Shieldline MSP', slug: 'shieldline', parentId: null, createdAt: iso(500 * DAY) },
];

// Every seeded user has the password: password123
const users = [
  { id: 1, tenantId: 1, email: 'admin@acme.test', displayName: 'Ada Admin', role: 'ADMIN' },
  { id: 2, tenantId: 1, email: 'analyst@acme.test', displayName: 'Ana Analyst', role: 'ANALYST' },
  { id: 3, tenantId: 1, email: 'viewer@acme.test', displayName: 'Vic Viewer', role: 'READ_ONLY' },
  { id: 4, tenantId: 2, email: 'admin@globex.test', displayName: 'Gil Globex', role: 'ADMIN' },
  { id: 5, tenantId: 3, email: 'msp@shieldline.test', displayName: 'Mo MSP', role: 'ADMIN' },
].map(u => ({ ...u, password: 'password123', createdAt: iso(200 * DAY) }));

const lists = [
  { id: 1, tenantId: 1, name: 'Partner allow list', kind: 'ALLOW', description: 'Vendors we must never block' },
  { id: 2, tenantId: 1, name: 'Manual blocks', kind: 'BLOCK', description: 'Added by the SOC during incidents' },
  { id: 3, tenantId: 1, name: 'Webroot sample', kind: 'THREAT', description: 'Scored threat intelligence feed' },
  { id: 4, tenantId: 2, name: 'Globex blocks', kind: 'BLOCK', description: null },
  { id: 5, tenantId: 1, name: 'CINS army', kind: 'BLOCK', description: 'Community feed of attacking hosts' },
].map((l, i) => ({ ...l, createdAt: iso((90 - i) * DAY) }));

let nextId = 1;
const ind = (listId, tenantId, value, type, extra = {}) => ({
  id: nextId++, listId, tenantId, value, type,
  category: null, score: null, description: null, expiresAt: null, source: 'manual',
  createdAt: iso((60 - nextId) * 3_600_000), ...extra,
});
const threat = (value, category, score) => ind(3, 1, value, value.includes('/') ? 'CIDR' : /^[\d.]+$/.test(value) ? 'IP' : 'DOMAIN', { category, score, source: 'webroot' });

const indicators = [
  ind(1, 1, '192.0.2.10', 'IP', { description: 'Payroll provider' }),
  ind(1, 1, 'partner.example', 'DOMAIN'),
  ind(2, 1, '203.0.113.7', 'IP', { description: 'Phishing landing page' }),
  ind(2, 1, '198.51.100.0/24', 'CIDR', { description: 'Hosting range used in incident #42' }),
  ind(2, 1, 'evil.example', 'DOMAIN'),
  ind(2, 1, 'malware-cdn.example', 'DOMAIN', { expiresAt: new Date(now + 7 * DAY).toISOString() }),
  threat('203.0.113.66', 'Botnets', 97),
  threat('192.0.2.200', 'Scanners', 64),
  threat('203.0.113.120', 'Phishing', 92),
  threat('198.18.0.0/15', 'Spam Sources', 75),
  threat('203.0.113.250', 'TOR Proxy', 55),
  threat('crypto-miner.example', 'Malware Sites', 99),
  threat('login-micr0soft.example', 'Phishing', 95),
  threat('192.0.2.77', 'Windows Exploits', 88),
  threat('203.0.113.45', 'Brute Force', 91),
  threat('203.0.113.46', 'Brute Force', 82),
  threat('stats-tracker.example', 'Spyware', 70),
  ind(4, 2, '203.0.113.99', 'IP'),
  ind(4, 2, 'ransom-note.example', 'DOMAIN'),
  ind(5, 1, '192.0.2.128/25', 'CIDR', { source: 'cins' }),
  ind(5, 1, '203.0.113.180', 'IP', { source: 'cins' }),
];

const ENFORCERS = ['edge-fw-01 (Enforce)', 'edge-fw-02 (Enforce)', 'dns-resolver-a (DNS)'];
const SRC = ['10.1.4.22', '10.1.7.13', '10.2.0.51', '10.1.9.200', '10.3.3.3'];
const events = Array.from({ length: 60 }, (_, i) => {
  const hit = indicators[(i * 7) % indicators.length];
  const allowed = hit.listId === 1;
  return {
    id: i + 1, tenantId: hit.tenantId, at: iso(i * 11 * 60_000),
    source: SRC[i % SRC.length], destination: hit.value.replace(/\/\d+$/, '').replace(/\.0$/, '.9'),
    indicatorId: hit.id, action: allowed ? 'ALLOW' : 'BLOCK',
    severity: hit.score >= 90 ? 'CRITICAL' : hit.score >= 70 ? 'HIGH' : allowed ? 'INFO' : 'MEDIUM',
    enforcementPoint: ENFORCERS[i % ENFORCERS.length],
  };
});

const alerts = events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').map((e, i) => ({
  id: i + 1, tenantId: e.tenantId, eventId: e.id, at: e.at, severity: e.severity,
  title: `Blocked traffic to ${e.destination}`, status: ['NEW', 'TRIAGED', 'RESOLVED'][i % 3], assignee: null,
}));

const audit = [
  { id: 1, tenantId: 1, at: iso(2 * DAY), actor: 'admin@acme.test', action: 'LIST_CREATED', target: 'Manual blocks' },
  { id: 2, tenantId: 1, at: iso(DAY), actor: 'analyst@acme.test', action: 'INDICATOR_ADDED', target: '203.0.113.7' },
];

module.exports = { tenants, users, lists, indicators, events, alerts, audit, settings: { threshold: 90 } };

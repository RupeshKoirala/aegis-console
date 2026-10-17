/*
 * Aegis fake API: implements the /api/v1 contract (see openapi.yaml) in memory, persisted to api/db.json.
 * You never need to edit this to do the exercises; read it later as a backend preview.
 *
 *   npm run api            start on http://localhost:3000
 *   npm run api:reset      throw away db.json and start from seed.cjs again
 *
 * Teaching switches (any request):
 *   ?_delay=1500           wait 1.5 s before answering (or env AEGIS_DELAY=ms for every request)
 *   ?_fail=500             answer with that error status
 *   X-Chaos: 0.3           fail ~30% of requests with 503
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');

const DB_FILE = path.join(__dirname, 'db.json');
const PORT = Number(process.env.PORT ?? 3000);
const SECRET = 'aegis-dev-secret-not-for-production';
const ACCESS_TTL_S = Number(process.env.AEGIS_TOKEN_TTL ?? 15 * 60);

// ── storage ─────────────────────────────────────────────────────────────────
if (process.argv.includes('--reset') && fs.existsSync(DB_FILE)) fs.rmSync(DB_FILE);
const db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : require('./seed.cjs');
let saveTimer;
const save = () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)), 50); };
save();
const nextId = (rows) => rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
const nowIso = () => new Date().toISOString();

// ── helpers ─────────────────────────────────────────────────────────────────
const problem = (res, status, title, detail, extra = {}) =>
  res.status(status).type('application/problem+json').send(JSON.stringify({ title, status, detail, instance: res.req.originalUrl.split('?')[0], ...extra }));

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
function issueToken(user) {
  const iat = Math.floor(Date.now() / 1000);
  const body = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: String(user.id), email: user.email, role: user.role, tenantId: user.tenantId, iat, exp: iat + ACCESS_TTL_S })}`;
  return `${body}.${sign(body)}`;
}
function verifyToken(token) {
  const [h, p, s] = String(token).split('.');
  if (!h || !p || !s || sign(`${h}.${p}`) !== s) return null;
  const claims = JSON.parse(Buffer.from(p, 'base64url').toString());
  return claims.exp * 1000 > Date.now() ? claims : null;
}
const refreshTokens = new Map(); // refreshToken -> userId
const revoked = new Set();

const me = (u) => ({ id: u.id, email: u.email, displayName: u.displayName, role: u.role, tenantId: u.tenantId, tenantName: db.tenants.find(t => t.id === u.tenantId)?.name });
const userView = ({ password, ...u }) => u;
const listView = (l) => ({ id: l.id, name: l.name, kind: l.kind, description: l.description, indicatorCount: db.indicators.filter(i => i.listId === l.id).length, createdAt: l.createdAt });
const indicatorView = ({ tenantId, ...i }) => i;

const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const DOMAIN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
function classify(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  if (IPV4.test(v)) return { value: v, type: 'IP' };
  const [ip, bits] = v.split('/');
  if (bits !== undefined && IPV4.test(ip) && /^\d+$/.test(bits) && +bits <= 32) return { value: v, type: 'CIDR' };
  if (DOMAIN.test(v)) return { value: v, type: 'DOMAIN' };
  return null;
}
const ipToInt = (ip) => ip.split('.').reduce((a, o) => (a << 8) + +o, 0) >>> 0;
function covers(indicator, q) {
  if (q.type === 'DOMAIN') return indicator.type === 'DOMAIN' && (q.value === indicator.value || q.value.endsWith('.' + indicator.value));
  if (indicator.type === 'IP') return indicator.value === q.value;
  if (indicator.type === 'CIDR') {
    const [net, bits] = indicator.value.split('/');
    const mask = +bits === 0 ? 0 : (~0 << (32 - +bits)) >>> 0;
    return ((ipToInt(q.value) & mask) >>> 0) === ((ipToInt(net) & mask) >>> 0);
  }
  return false;
}

// ── app ─────────────────────────────────────────────────────────────────────
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Tenant-Id, X-Correlation-Id, X-Chaos');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.set('Access-Control-Expose-Headers', 'Location, X-Correlation-Id');
  if (req.headers['x-correlation-id']) res.set('X-Correlation-Id', req.headers['x-correlation-id']);
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  const delay = Number(req.query._delay ?? process.env.AEGIS_DELAY ?? 0);
  setTimeout(() => {
    if (req.query._fail) return problem(res, Number(req.query._fail), 'Simulated failure', `You asked for ?_fail=${req.query._fail}`);
    if (Math.random() < Number(req.headers['x-chaos'] ?? 0)) return problem(res, 503, 'Service Unavailable', 'Chaos mode dropped this request');
    next();
  }, delay);
});
const log = (req, res, next) => { const t = Date.now(); res.on('finish', () => console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - t}ms)`)); next(); };
app.use(log);

const api = express.Router();

api.get('/actuator/health', (_req, res) => res.json({ status: 'UP' }));

api.post('/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return problem(res, 400, 'Bad Request', 'email and password are required');
  const user = db.users.find(u => u.email === String(email).toLowerCase() && u.password === password);
  if (!user) return problem(res, 401, 'Unauthorized', 'Wrong email or password');
  const refreshToken = crypto.randomBytes(24).toString('base64url');
  refreshTokens.set(refreshToken, user.id);
  res.json({ token: issueToken(user), refreshToken, expiresIn: ACCESS_TTL_S, user: me(user) });
});

api.post('/auth/refresh', (req, res) => {
  const userId = refreshTokens.get(req.body?.refreshToken);
  if (!userId) return problem(res, 401, 'Unauthorized', 'Refresh token is invalid or was already used');
  refreshTokens.delete(req.body.refreshToken); // rotation: each refresh token works once
  const user = db.users.find(u => u.id === userId);
  const refreshToken = crypto.randomBytes(24).toString('base64url');
  refreshTokens.set(refreshToken, user.id);
  res.json({ token: issueToken(user), refreshToken, expiresIn: ACCESS_TTL_S, user: me(user) });
});

// Everything below needs a valid bearer token.
api.use((req, res, next) => {
  const token = (req.headers.authorization ?? '').replace(/^Bearer /, '') || req.query.access_token; // EventSource can't send headers
  // Training shortcut (until you build real login in M15): "Bearer dev:<email>" acts as that seeded user.
  const devUser = String(token ?? '').startsWith('dev:') ? db.users.find(u => u.email === token.slice(4)) : null;
  const claims = devUser ? { sub: String(devUser.id) } : token && !revoked.has(token) ? verifyToken(token) : null;
  if (!claims) { res.set('WWW-Authenticate', 'Bearer'); return problem(res, 401, 'Unauthorized', 'Missing, invalid or expired token'); }
  req.user = db.users.find(u => u.id === +claims.sub);
  req.token = token;
  // MSP admins may act for a child tenant by sending X-Tenant-Id.
  req.tenantId = req.user.tenantId;
  const wanted = Number(req.headers['x-tenant-id']);
  if (wanted && wanted !== req.user.tenantId) {
    const child = db.tenants.find(t => t.id === wanted);
    if (!child || child.parentId !== req.user.tenantId) return problem(res, 403, 'Forbidden', 'You may only act for your own tenant or its child tenants');
    req.tenantId = wanted;
  }
  next();
});
const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : problem(res, 403, 'Forbidden', `Requires role ${roles.join(' or ')}`);
const ownList = (req, res) => {
  const list = db.lists.find(l => l.id === +req.params.id && l.tenantId === req.tenantId);
  if (!list) problem(res, 404, 'Not Found', `List ${req.params.id} not found`);
  return list;
};

api.post('/auth/logout', (req, res) => { revoked.add(req.token); res.sendStatus(204); });
api.get('/me', (req, res) => res.json(me(req.user)));
api.get('/tenants/current', (req, res) => res.json(db.tenants.find(t => t.id === req.tenantId)));
api.get('/tenants/children', (req, res) => res.json(db.tenants.filter(t => t.parentId === req.user.tenantId)));

api.get('/users', (req, res) => res.json(db.users.filter(u => u.tenantId === req.tenantId).map(userView)));
api.post('/users', requireRole('ADMIN'), (req, res) => {
  const { email, displayName, role, password } = req.body ?? {};
  const errors = {};
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email ?? '')) errors.email = 'must be a well-formed email address';
  if (!displayName || displayName.length > 100) errors.displayName = 'must not be blank (max 100)';
  if (!['ADMIN', 'ANALYST', 'READ_ONLY'].includes(role)) errors.role = 'must be ADMIN, ANALYST or READ_ONLY';
  if (!password || password.length < 8 || password.length > 72) errors.password = 'size must be between 8 and 72';
  if (Object.keys(errors).length) return problem(res, 400, 'Bad Request', 'Validation failed', { errors });
  if (db.users.some(u => u.email === email.toLowerCase())) return problem(res, 409, 'Conflict', 'Email already registered');
  const user = { id: nextId(db.users), tenantId: req.tenantId, email: email.toLowerCase(), displayName, role, password, createdAt: nowIso() };
  db.users.push(user); save();
  res.status(201).location(`/api/v1/users/${user.id}`).json(userView(user));
});

api.get('/lists', (req, res) => res.json(db.lists.filter(l => l.tenantId === req.tenantId).sort((a, b) => a.name.localeCompare(b.name)).map(listView)));
api.post('/lists', requireRole('ADMIN', 'ANALYST'), (req, res) => {
  const { name, kind, description = null } = req.body ?? {};
  const errors = {};
  if (!name || String(name).trim().length === 0 || name.length > 80) errors.name = 'must not be blank (max 80)';
  if (!['ALLOW', 'BLOCK', 'THREAT'].includes(kind)) errors.kind = 'must be ALLOW, BLOCK or THREAT';
  if (description && description.length > 500) errors.description = 'max 500 characters';
  if (Object.keys(errors).length) return problem(res, 400, 'Bad Request', 'Validation failed', { errors });
  if (db.lists.some(l => l.tenantId === req.tenantId && l.name.toLowerCase() === name.trim().toLowerCase())) return problem(res, 409, 'Conflict', `A list named "${name}" already exists`);
  const list = { id: nextId(db.lists), tenantId: req.tenantId, name: name.trim(), kind, description, createdAt: nowIso() };
  db.lists.push(list);
  db.audit.push({ id: nextId(db.audit), tenantId: req.tenantId, at: nowIso(), actor: req.user.email, action: 'LIST_CREATED', target: list.name });
  save();
  res.status(201).location(`/api/v1/lists/${list.id}`).json(listView(list));
});
api.get('/lists/:id', (req, res) => { const l = ownList(req, res); if (l) res.json(listView(l)); });
api.delete('/lists/:id', requireRole('ADMIN'), (req, res) => {
  const l = ownList(req, res); if (!l) return;
  db.lists = db.lists.filter(x => x !== l);
  db.indicators = db.indicators.filter(i => i.listId !== l.id);
  save(); res.sendStatus(204);
});

api.get('/lists/:id/indicators', (req, res) => {
  const l = ownList(req, res); if (!l) return;
  const page = Number(req.query.page ?? 0), size = Number(req.query.size ?? 50);
  if (!(page >= 0) || !(size >= 1 && size <= 200)) return problem(res, 400, 'Bad Request', 'page must be ≥ 0 and size between 1 and 200');
  const q = String(req.query.q ?? '').toLowerCase();
  const rows = db.indicators.filter(i => i.listId === l.id && (!q || i.value.includes(q) || (i.category ?? '').toLowerCase().includes(q)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ items: rows.slice(page * size, page * size + size).map(indicatorView), page, size, total: rows.length });
});
api.post('/lists/:id/indicators', requireRole('ADMIN', 'ANALYST'), (req, res) => {
  const l = ownList(req, res); if (!l) return;
  const { value, category = null, score = null, description = null, expiresAt = null } = req.body ?? {};
  const errors = {};
  const c = classify(value);
  if (!value) errors.value = 'must not be blank';
  else if (!c) errors.value = 'must be an IPv4 address, IPv4 CIDR or domain name';
  if (l.kind === 'THREAT') {
    if (!category) errors.category = 'is required on threat lists';
    if (!(Number.isInteger(score) && score >= 1 && score <= 100)) errors.score = 'must be between 1 and 100';
  } else {
    if (category !== null) errors.category = 'only allowed on threat lists';
    if (score !== null) errors.score = 'only allowed on threat lists';
  }
  if (description && description.length > 500) errors.description = 'max 500 characters';
  if (expiresAt && !(Date.parse(expiresAt) > Date.now())) errors.expiresAt = 'must be a future instant';
  if (Object.keys(errors).length) return problem(res, 400, 'Bad Request', 'Validation failed', { errors });
  if (l.kind === 'ALLOW' && c.type === 'CIDR' && c.value.endsWith('/0')) return problem(res, 400, 'Bad Request', 'An allow list may not contain /0: that would allow the whole internet');
  if (db.indicators.some(i => i.listId === l.id && i.value === c.value)) return problem(res, 409, 'Conflict', `${c.value} is already on this list`);
  const row = { id: nextId(db.indicators), listId: l.id, tenantId: req.tenantId, value: c.value, type: c.type, category, score, description, expiresAt, source: 'manual', createdAt: nowIso() };
  db.indicators.push(row);
  db.audit.push({ id: nextId(db.audit), tenantId: req.tenantId, at: nowIso(), actor: req.user.email, action: 'INDICATOR_ADDED', target: row.value });
  save();
  res.status(201).location(`/api/v1/lists/${l.id}/indicators/${row.id}`).json(indicatorView(row));
});
api.delete('/lists/:id/indicators/:indicatorId', requireRole('ADMIN', 'ANALYST'), (req, res) => {
  const l = ownList(req, res); if (!l) return;
  const row = db.indicators.find(i => i.id === +req.params.indicatorId && i.listId === l.id);
  if (!row) return problem(res, 404, 'Not Found', `Indicator ${req.params.indicatorId} not found`);
  db.indicators = db.indicators.filter(i => i !== row);
  save(); res.sendStatus(204);
});

// Verdict: allow beats block; block list → BLOCK; threat score ≥ threshold → BLOCK; else NONE.
api.get('/verdict', (req, res) => {
  const q = classify(req.query.q);
  if (!q) return problem(res, 400, 'Bad Request', 'q must be an IPv4 address or a domain name');
  if (q.type === 'CIDR') return problem(res, 400, 'Bad Request', 'A verdict is for one IP address or domain, not a CIDR block');
  const threshold = db.settings.threshold;
  const lists = new Map(db.lists.filter(l => l.tenantId === req.tenantId).map(l => [l.id, l]));
  const matches = db.indicators.filter(i => lists.has(i.listId) && covers(i, q) && !(i.expiresAt && Date.parse(i.expiresAt) < Date.now()))
    .map(i => ({ listId: i.listId, listName: lists.get(i.listId).name, kind: lists.get(i.listId).kind, value: i.value, category: i.category, score: i.score }));
  const has = (k) => matches.some(m => m.kind === k);
  const [verdict, reason] =
    has('ALLOW') ? ['ALLOW', 'ALLOW_LIST'] :
    has('BLOCK') ? ['BLOCK', 'BLOCK_LIST'] :
    matches.some(m => m.kind === 'THREAT' && m.score >= threshold) ? ['BLOCK', 'THREAT_SCORE'] :
    has('THREAT') ? ['NONE', 'BELOW_THRESHOLD'] : ['NONE', 'NO_MATCH'];
  res.json({ query: q.value, type: q.type, verdict, reason, threshold, matches, engine: 'fake' });
});

// ── extensions used by later console modules (not in the Study Hub capstone contract) ──
api.get('/events', (req, res) => {
  const page = Number(req.query.page ?? 0), size = Math.min(Number(req.query.size ?? 50), 200);
  const rows = db.events.filter(e => e.tenantId === req.tenantId && (!req.query.action || e.action === req.query.action)).sort((a, b) => b.at.localeCompare(a.at));
  res.json({ items: rows.slice(page * size, page * size + size), page, size, total: rows.length });
});
api.get('/events/stream', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  const rate = Math.max(50, Number(req.query.every ?? 1000));
  const tenantInds = db.indicators.filter(i => i.tenantId === req.tenantId);
  let id = nextId(db.events);
  const timer = setInterval(() => {
    const hit = tenantInds[Math.floor(Math.random() * tenantInds.length)];
    const allowed = db.lists.find(l => l.id === hit.listId)?.kind === 'ALLOW';
    const ev = { id: id++, tenantId: req.tenantId, at: nowIso(), source: `10.1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 254) + 1}`,
      destination: hit.value.split('/')[0], indicatorId: hit.id, action: allowed ? 'ALLOW' : 'BLOCK',
      severity: hit.score >= 90 ? 'CRITICAL' : hit.score >= 70 ? 'HIGH' : allowed ? 'INFO' : 'MEDIUM', enforcementPoint: 'edge-fw-01 (Enforce)' };
    res.write(`event: traffic\nid: ${ev.id}\ndata: ${JSON.stringify(ev)}\n\n`);
  }, rate);
  req.on('close', () => clearInterval(timer));
});
api.get('/alerts', (req, res) => res.json(db.alerts.filter(a => a.tenantId === req.tenantId && (!req.query.status || a.status === req.query.status)).sort((a, b) => b.at.localeCompare(a.at))));
api.patch('/alerts/:id', requireRole('ADMIN', 'ANALYST'), (req, res) => {
  const a = db.alerts.find(x => x.id === +req.params.id && x.tenantId === req.tenantId);
  if (!a) return problem(res, 404, 'Not Found', `Alert ${req.params.id} not found`);
  const { status, assignee } = req.body ?? {};
  if (status && !['NEW', 'TRIAGED', 'RESOLVED'].includes(status)) return problem(res, 400, 'Bad Request', 'Validation failed', { errors: { status: 'must be NEW, TRIAGED or RESOLVED' } });
  Object.assign(a, status ? { status } : {}, assignee !== undefined ? { assignee } : {});
  save(); res.json(a);
});
api.get('/audit', (req, res) => res.json(db.audit.filter(a => a.tenantId === req.tenantId).sort((a, b) => b.at.localeCompare(a.at))));
api.get('/settings', (_req, res) => res.json(db.settings));

app.use('/api/v1', api);
app.use((req, res) => problem(res, 404, 'Not Found', `No route for ${req.method} ${req.path}`));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Aegis fake API on http://localhost:${PORT}/api/v1  (users: admin@acme.test / password123)`));
}
module.exports = { app, classify, covers };

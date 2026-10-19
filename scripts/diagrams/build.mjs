// Builds public/diagrams/mNN.svg from scripts/diagrams/specs/mNN.mjs.
//   npm run diagrams            all modules
//   npm run diagrams -- m05     one module
// Every map uses the same visual language, so you learn to read it once (see LEGEND below).
// A spec is small on purpose: add your own boxes and arrows as you learn, then rebuild.
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../public/diagrams');
const only = process.argv[2];

// Grid: nodes sit on cells (col, row); fractions are fine (1.5 = between columns).
const COL = 240, ROW = 118, X0 = 34, Y0 = 108, NW = 196, NH = 62, W = 1000;

const KIND = {
  comp: { tag: 'component', rx: 3 },
  dir: { tag: 'directive', rx: 3 },
  pipe: { tag: 'pipe', rx: 3 },
  svc: { tag: 'service', rx: 20 },
  store: { tag: 'store', rx: 20 },
  token: { tag: 'token', rx: 3 },
  fn: { tag: 'functions', rx: 3 },
  module: { tag: 'NgModule', rx: 3 },
  route: { tag: 'route', rx: 3 },
  ext: { tag: 'outside', rx: 10 },
  tool: { tag: 'tool', rx: 10 },
};
const EDGE = {
  data: 'data in (inputs, responses, signal reads)',
  event: 'events out (outputs, emits)',
  di: 'inject() / provides',
  router: 'router',
  call: 'renders / calls',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tw = (s, px) => String(s).length * px * 0.56;

const STYLE = `
  .bg { fill: #ffffff; } .title { fill: #0f172a; font: 700 20px system-ui, sans-serif; }
  .lead { fill: #475569; font: 14px system-ui, sans-serif; }
  .node { fill: #ffffff; stroke: #334155; stroke-width: 1.5; }
  .node.svc, .node.store { fill: #eef2ff; stroke: #4f46e5; } .node.token { fill: #fdf4ff; stroke: #a21caf; }
  .node.dir, .node.pipe { fill: #f0fdfa; stroke: #0f766e; } .node.fn { fill: #f8fafc; stroke: #64748b; stroke-dasharray: 2 3; }
  .node.module { fill: #fff7ed; stroke: #9a3412; } .node.route { fill: #fff7ed; stroke: #ea580c; }
  .node.ext, .node.tool { fill: #f1f5f9; stroke: #94a3b8; }
  .node.hot { stroke: #dc2626; stroke-width: 2.5; }
  .label { fill: #0f172a; font: 600 14px system-ui, sans-serif; } .sub { fill: #64748b; font: 10.5px ui-monospace, Menlo, monospace; }
  .tag { fill: #64748b; font: italic 10px system-ui, sans-serif; }
  .group { fill: none; stroke: #cbd5e1; stroke-dasharray: 6 5; } .gl { fill: #64748b; font: 700 12px system-ui, sans-serif; }
  .e { fill: none; stroke-width: 1.8; } .e.data { stroke: #2563eb; } .e.event { stroke: #16a34a; }
  .e.di { stroke: #7c3aed; stroke-dasharray: 6 4; } .e.router { stroke: #ea580c; } .e.call { stroke: #64748b; }
  .el { font: 11px ui-monospace, Menlo, monospace; } .el.data { fill: #1d4ed8; } .el.event { fill: #15803d; }
  .el.di { fill: #6d28d9; } .el.router { fill: #c2410c; } .el.call { fill: #475569; }
  .elbg { fill: #ffffff; opacity: .92; }
  .ah.data { fill: #2563eb; } .ah.event { fill: #16a34a; } .ah.di { fill: #7c3aed; } .ah.router { fill: #ea580c; } .ah.call { fill: #64748b; }
  .legend { fill: #475569; font: 11px system-ui, sans-serif; } .note { fill: #334155; font: 12.5px system-ui, sans-serif; }
  .rule { stroke: #e2e8f0; }
  @media (prefers-color-scheme: dark) {
    .bg { fill: #0b1220; } .title, .label { fill: #e2e8f0; } .lead, .note { fill: #94a3b8; }
    .node { fill: #111a2e; stroke: #94a3b8; } .node.svc, .node.store { fill: #1e1b4b; stroke: #818cf8; }
    .node.token { fill: #3b0764; stroke: #e879f9; } .node.dir, .node.pipe { fill: #042f2e; stroke: #2dd4bf; }
    .node.fn { fill: #0f172a; stroke: #94a3b8; } .node.module, .node.route { fill: #431407; stroke: #fb923c; }
    .node.ext, .node.tool { fill: #1e293b; stroke: #64748b; } .node.hot { stroke: #f87171; }
    .sub, .tag, .gl, .legend { fill: #94a3b8; } .group { stroke: #334155; } .elbg { fill: #0b1220; } .rule { stroke: #1e293b; }
    .e.data { stroke: #60a5fa; } .e.event { stroke: #4ade80; } .e.di { stroke: #a78bfa; } .e.router { stroke: #fb923c; } .e.call { stroke: #94a3b8; }
    .el.data { fill: #93c5fd; } .el.event { fill: #86efac; } .el.di { fill: #c4b5fd; } .el.router { fill: #fdba74; } .el.call { fill: #cbd5e1; }
    .ah.data { fill: #60a5fa; } .ah.event { fill: #4ade80; } .ah.di { fill: #a78bfa; } .ah.router { fill: #fb923c; } .ah.call { fill: #94a3b8; }
  }`;

function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function render(spec) {
  const nodes = new Map();
  for (const [id, kind, label, sub, c, r, opts = {}] of spec.nodes) {
    if (!KIND[kind]) throw new Error(`${spec.id}: unknown kind ${kind}`);
    nodes.set(id, { id, kind, label, sub, x: X0 + c * COL, y: Y0 + r * ROW, w: opts.w ?? NW, h: NH, ...opts });
  }
  const maxR = Math.max(...spec.nodes.map(n => n[5]));
  const leadLines = wrap(spec.lead, 120);
  const y0 = leadLines.length > 1 ? 18 : 0;
  for (const n of nodes.values()) n.y += y0;
  const bodyBottom = Y0 + y0 + maxR * ROW + NH + 40;
  const notes = (spec.notes ?? []).flatMap((t, i) => wrap(`${i + 1}. ${t}`, 135).map((l, j) => ({ l, first: j === 0 })));
  const H = bodyBottom + 86 + notes.length * 19;
  const p = [];
  p.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.title)}">`);
  p.push(`<title>${esc(spec.title)}</title><style>${STYLE}</style>`);
  p.push(`<defs>${Object.keys(EDGE).map(k => `<marker id="a-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah ${k}" d="M0,0 L10,5 L0,10 z"/></marker>`).join('')}</defs>`);
  p.push(`<rect class="bg" width="${W}" height="${H}" rx="12"/>`);
  p.push(`<text class="title" x="${X0}" y="40">${esc(spec.title)}</text>`);
  leadLines.forEach((l, i) => p.push(`<text class="lead" x="${X0}" y="${64 + i * 18}">${esc(l)}</text>`));

  for (const [label, c0, r0, c1, r1] of spec.groups ?? []) {
    const x = X0 + c0 * COL - 14, y = Y0 + y0 + r0 * ROW - 30;
    const w = (c1 - c0) * COL + NW + 28, h = (r1 - r0) * ROW + NH + 44;
    p.push(`<rect class="group" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text class="gl" x="${x + 10}" y="${y + 16}">${esc(label)}</text>`);
  }

  const labels = [];
  const pairTotal = new Map(), pairCount = new Map();
  const fanOut = new Map(), fanIn = new Map();
  for (const [from, to] of spec.edges) { fanOut.set(from, (fanOut.get(from) ?? 0) + 1); fanIn.set(to, (fanIn.get(to) ?? 0) + 1); }
  for (const [from, to] of spec.edges) { const key = [from, to].sort().join('|'); pairTotal.set(key, (pairTotal.get(key) ?? 0) + 1); }
  for (const [from, to, kind, label, opts = {}] of spec.edges) {
    const a = nodes.get(from), b = nodes.get(to);
    if (!a || !b) throw new Error(`${spec.id}: edge ${from}->${to} has a missing node`);
    if (!EDGE[kind]) throw new Error(`${spec.id}: unknown edge kind ${kind}`);
    const key = [from, to].sort().join('|'); const nth = pairCount.get(key) ?? 0; pairCount.set(key, nth + 1);
    const total = pairTotal.get(key); const off = opts.offset ?? (nth - (total - 1) / 2) * 22;
    const acx = a.x + a.w / 2, acy = a.y + a.h / 2, bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
    const dx = bcx - acx, dy = bcy - acy;
    let x1, y1, x2, y2, v;
    const lwNeed = label ? tw(label, 11) + 18 : 0;
    const gap = dx > 0 ? b.x - (a.x + a.w) : a.x - (b.x + b.w);
    if (a === b) {
      // self-reference: a small loop on the right edge
      const rx = a.x + a.w, d = `M${rx},${a.y + 18} C${rx + 46},${a.y + 4} ${rx + 46},${a.y + a.h - 4} ${rx},${a.y + a.h - 18}`;
      p.push(`<path class="e ${kind}" d="${d}" marker-end="url(#a-${kind})"/>`);
      if (label) { const lw = tw(label, 11) + 10; labels.push(`<rect class="elbg" x="${rx + 38}" y="${a.y + a.h / 2 - 9}" width="${lw}" height="16" rx="4"/><text class="el ${kind}" x="${rx + 43}" y="${a.y + a.h / 2 + 3}">${esc(label)}</text>`); }
      continue;
    }
    if (Math.abs(dy) < NH && gap < lwNeed && opts.side !== 'h') {
      // neighbours too close for a label: arc over the top
      x1 = acx + Math.sign(dx) * a.w / 4; x2 = bcx - Math.sign(dx) * b.w / 4; y1 = a.y; y2 = b.y;
      const top = Math.min(a.y, b.y) - 44;
      p.push(`<path class="e ${kind}" d="M${x1},${y1} C${x1},${top} ${x2},${top} ${x2},${y2}" marker-end="url(#a-${kind})"${opts.both ? ` marker-start="url(#a-${kind})"` : ''}/>`);
      if (label) { const lw = tw(label, 11) + 10, mx = (x1 + x2) / 2, my = top + 11; labels.push(`<rect class="elbg" x="${mx - lw / 2}" y="${my - 9}" width="${lw}" height="16" rx="4"/><text class="el ${kind}" x="${mx}" y="${my + 3}" text-anchor="middle">${esc(label)}</text>`); }
      continue;
    }
    if (opts.side === 'h' || (opts.side !== 'v' && Math.abs(dy) < NH)) {
      v = false; x1 = dx > 0 ? a.x + a.w : a.x; x2 = dx > 0 ? b.x : b.x + b.w; y1 = acy + off; y2 = bcy + off;
    } else {
      v = true; y1 = dy > 0 ? a.y + a.h : a.y; y2 = dy > 0 ? b.y : b.y + b.h; x1 = acx + off; x2 = bcx + off;
      if (dy === 0) { y1 = a.y + a.h; y2 = b.y + b.h; }
    }
    const loop = v && dy === 0; const k = loop ? 46 : v ? Math.abs(y2 - y1) / 2 : Math.abs(x2 - x1) / 2;
    const c1 = v ? [x1, y1 + (loop ? k : Math.sign(dy) * k)] : [x1 + Math.sign(dx) * k, y1];
    const c2 = v ? [x2, y2 + (loop ? k : -Math.sign(dy) * k)] : [x2 - Math.sign(dx) * k, y2];
    const both = opts.both ? ` marker-start="url(#a-${kind})"` : '';
    p.push(`<path class="e ${kind}" d="M${x1},${y1} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x2},${y2}" marker-end="url(#a-${kind})"${both}/>`);
    if (label) {
      // fan-out edges get their label near the target, fan-in edges near the source, so labels don't collide
      const t = opts.t ?? (fanOut.get(from) > 1 ? 0.66 : fanIn.get(to) > 1 ? 0.34 : 0.5), u = 1 - t;
      const bz = (p0, p1, p2, p3) => u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
      const mx = bz(x1, c1[0], c2[0], x2);
      const my = bz(y1, c1[1], c2[1], y2) + (opts.ly ?? 0);
      const lw = tw(label, 11) + 10;
      // parallel edges: push labels apart (left/right of vertical edges, above/below horizontal ones)
      const lx0 = v && off ? mx + Math.sign(off) * (lw / 2 + 4) : mx;
      const ly0 = !v && off ? my + Math.sign(off) * 10 : my;
      labels.push(`<rect class="elbg" x="${lx0 - lw / 2}" y="${ly0 - 9}" width="${lw}" height="16" rx="4"/><text class="el ${kind}" x="${lx0}" y="${ly0 + 3}" text-anchor="middle">${esc(label)}</text>`);
    }
  }

  for (const n of nodes.values()) {
    const kd = KIND[n.kind];
    // squeeze text that would overflow the box instead of clipping it
    const fit = (t, px) => (tw(t, px) + 20 > n.w ? ` textLength="${n.w - 20}" lengthAdjust="spacingAndGlyphs"` : '');
    p.push(`<rect class="node ${n.kind}${n.hot ? ' hot' : ''}" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${kd.rx}"/>`);
    p.push(`<text class="tag" x="${n.x + 10}" y="${n.y + 15}">${esc(n.tag ?? kd.tag)}</text>`);
    p.push(`<text class="label" x="${n.x + 10}" y="${n.y + 35}"${fit(n.label, 14.3)}>${esc(n.label)}</text>`);
    if (n.sub) p.push(`<text class="sub" x="${n.x + 10}" y="${n.y + 52}"${fit(n.sub, 11.3)}>${esc(n.sub)}</text>`);
  }
  p.push(...labels);

  // legend
  let lx = X0; let ly = bodyBottom;
  p.push(`<line class="rule" x1="${X0}" x2="${W - X0}" y1="${ly - 18}" y2="${ly - 18}"/>`);
  for (const [k, text] of Object.entries(EDGE)) {
    if (lx + 40 + tw(text, 11) > W - X0) { lx = X0; ly += 22; }
    p.push(`<path class="e ${k}" d="M${lx},${ly} L${lx + 28},${ly}" marker-end="url(#a-${k})"/><text class="legend" x="${lx + 34}" y="${ly + 4}">${esc(text)}</text>`);
    lx += 40 + tw(text, 11) + 22;
  }
  const ky = ly + 26; lx = X0;
  for (const k of ['comp', 'svc', 'dir', 'token', 'fn', 'route', 'ext']) {
    p.push(`<rect class="node ${k}" x="${lx}" y="${ky - 10}" width="22" height="14" rx="${Math.min(KIND[k].rx, 7)}"/><text class="legend" x="${lx + 28}" y="${ky + 1}">${KIND[k].tag}${k === 'dir' ? ' / pipe' : ''}</text>`);
    lx += 40 + tw(KIND[k].tag, 11) + (k === 'dir' ? 50 : 18);
  }
  p.push(`<rect class="node hot" x="${lx}" y="${ky - 10}" width="22" height="14" rx="3"/><text class="legend" x="${lx + 28}" y="${ky + 1}">the bug hunt lives here</text>`);
  notes.forEach((n, i) => p.push(`<text class="note" x="${X0 + (n.first ? 0 : 16)}" y="${ky + 34 + i * 19}">${esc(n.l)}</text>`));
  p.push('</svg>');
  return p.join('\n');
}

mkdirSync(out, { recursive: true });
const files = readdirSync(path.join(here, 'specs')).filter(f => f.endsWith('.mjs') && (!only || f.startsWith(only)));
for (const f of files.sort()) {
  const spec = (await import(pathToFileURL(path.join(here, 'specs', f)).href)).default;
  writeFileSync(path.join(out, `${spec.id}.svg`), render(spec) + '\n');
  console.log(`✔ public/diagrams/${spec.id}.svg`);
}

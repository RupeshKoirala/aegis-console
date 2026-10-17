// usage: node gen.mjs <stub|sol> <srcDir> <outDir>
import fs from 'node:fs'; import path from 'node:path';
const [mode, src, out] = process.argv.slice(2);
const isMark = (l, m) => { const t = l.trim(); return t === `//@@${m}` || t === `<!--@@${m}-->` || t === `/*@@${m}*/`; };
function transform(text) {
  const lines = text.split('\n'); const res = []; let state = 'none';
  for (const l of lines) {
    if (isMark(l, 'sol')) { state = 'sol'; continue; }
    if (isMark(l, 'stub')) { state = 'stub'; continue; }
    if (isMark(l, 'end')) { state = 'none'; continue; }
    if (state === 'none' || state === mode) res.push(l);
  }
  return res.join('\n');
}
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name); const rel = path.relative(src, p); const o = path.join(out, rel);
    if (f.isDirectory()) { fs.mkdirSync(o, { recursive: true }); walk(p); }
    else fs.writeFileSync(o, transform(fs.readFileSync(p, 'utf8')));
  }
}
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true }); walk(src);

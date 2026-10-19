// Second pass: throw away your solution of one module and start again from the starter files.
//   npm run redo -- m05          back up your current m05 to branch pass1/m05, then restore the starters
//   npm run redo -- m05 --dry    show what would happen
// Your pass-1 work is never lost: `git diff pass1/m05 -- src/app/modules/m05-*` compares both passes.
import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const [arg, ...rest] = process.argv.slice(2);
const dry = rest.includes('--dry');
if (!arg) { console.error('Usage: npm run redo -- m05'); process.exit(1); }
const id = `m${arg.toLowerCase().replace(/^m/, '').padStart(2, '0')}`;
const dir = readdirSync('src/app/modules').find(d => d.startsWith(`${id}-`));
if (!dir) { console.error(`No module ${id}`); process.exit(1); }
const path = `src/app/modules/${dir}`;
const sh = (cmd, opts = {}) => { console.log(`$ ${cmd}`); return dry ? '' : execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }); };
const out = cmd => execSync(cmd, { encoding: 'utf8' }).trim();

const branch = `pass1/${id}`;
if (out(`git branch --list ${branch}`)) { console.error(`${branch} already exists. Delete it first (git branch -D ${branch}) if you really want a new backup.`); process.exit(1); }

// 1. Snapshot the module as it is now (committed or not) on pass1/mNN, without touching your working tree.
const dirty = out(`git status --porcelain -- ${path}`);
if (dirty && !dry) {
  sh(`git add -- ${path}`);
  const tree = out('git write-tree');
  const commit = out(`git commit-tree ${tree} -p HEAD -m "pass 1 of ${id} (backup by npm run redo)"`);
  sh(`git branch ${branch} ${commit}`);
  sh(`git reset -q -- ${path}`);
} else sh(`git branch ${branch} HEAD`);

// 2. Bring back the starter files from the course's main branch.
sh('git fetch -q origin main');
sh(`git rm -rq --cached --ignore-unmatch -- ${path}`, { stdio: 'ignore' });
sh(`git clean -fdq -- ${path}`);
sh(`git checkout origin/main -- ${path}`);
console.log(`\n✔ ${id} is back to its starter files. Your first pass is on branch ${branch}.`);
console.log(`  Next: open ${path}/README.md, then npm run ex -- ${id}/01`);
console.log(`  Compare later: git diff ${branch} -- ${path}`);

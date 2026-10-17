// Run the tests of one exercise (or a whole module) in watch mode.
//   npm run ex -- m01/02          one exercise, watch mode
//   npm run ex -- m01             every exercise in module M01
//   npm run ex -- m01/02 --once   run once and exit
import { readdirSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const [arg, ...rest] = process.argv.slice(2);
const usage = () => { console.error('Usage: npm run ex -- m01/02   (or m01 for the whole module)'); process.exit(1); };
if (!arg) usage();
const [modPart, exPart] = arg.toLowerCase().replace(/^m?/, '').split('/');
const pad = (s) => s.padStart(2, '0');
const root = 'src/app/modules';
const mod = readdirSync(root).find(d => d.startsWith(`m${pad(modPart)}-`));
if (!mod) { console.error(`No module m${pad(modPart)} in ${root}`); process.exit(1); }
let target = `${root}/${mod}`;
if (exPart) {
  const ex = readdirSync(target).find(d => d.startsWith(`${pad(exPart)}-`));
  if (!ex) { console.error(`No exercise ${pad(exPart)} in ${target}`); process.exit(1); }
  target += `/${ex}`;
}
if (!existsSync(target)) usage();
const once = rest.includes('--once');
console.log(`\n▶ ${target}  (${once ? 'single run' : 'watch mode, Ctrl+C to stop'})\n`);
spawn('npx', ['ng', 'test', '--include', target, `--watch=${!once}`], { stdio: 'inherit', shell: process.platform === 'win32' })
  .on('exit', code => process.exit(code ?? 0));

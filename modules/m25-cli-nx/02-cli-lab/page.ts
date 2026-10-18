import { Component, signal } from '@angular/core';

const KEY = 'aegis.m25.lab';
interface Step { id: string; title: string; cmd: string; why: string }

const STEPS: Step[] = [
  { id: 'gen', title: 'Generate, don\'t hand-write', cmd: 'npx ng g component modules/scratch/hello --dry-run', why: 'Schematics apply the project conventions (standalone, OnPush, style, test file). --dry-run shows the files without writing them.' },
  { id: 'gen2', title: 'Every generator', cmd: 'npx ng g --help', why: 'service, guard (functional), interceptor, pipe, directive, resolver, environments, config…' },
  { id: 'cfg', title: 'Project defaults', cmd: 'open angular.json → "schematics"', why: 'Set e.g. "@schematics/angular:component": { "changeDetection": "OnPush" } once, and every generated component follows it.' },
  { id: 'upd', title: 'Updating Angular', cmd: 'npx ng update', why: 'Lists updatable packages. `ng update @angular/core @angular/cli` runs MIGRATIONS (schematics that rewrite your code), which is how teams move a major version safely. Check update.angular.dev first.' },
  { id: 'mig', title: 'Built-in migrations', cmd: 'npx ng g @angular/core:control-flow --dry-run', why: 'Converts *ngIf/*ngFor to @if/@for. Also :signal-input-migration, :inject (constructor → inject()), :standalone. This is how big codebases move from Gen 1 to Gen 3.' },
  { id: 'lib', title: 'A workspace library', cmd: 'npx ng g library aegis-ui (in a scratch copy of the repo)', why: 'projects/aegis-ui with its own public-api.ts and ng-packagr build: shareable UI, versioned and published to a private npm registry.' },
  { id: 'nx', title: 'Nx in 10 minutes', cmd: 'npx create-nx-workspace@latest aegis-nx --preset=angular-monorepo', why: 'apps/ + libs/ with tags, `nx graph` (dependency picture), `nx affected -t test` (only test what a change touches), and the module-boundaries rule from M25.01.' },
  { id: 'schem', title: 'Your own schematic (stretch)', cmd: 'npx @angular-devkit/schematics-cli blank --name=aegis-schematics', why: 'A generator that scaffolds an Aegis feature (page + store + spec + route entry) the way your team likes it.' },
];

@Component({
  selector: 'app-m25-02',
  template: `
    <h1>CLI, schematics & Nx lab</h1>
    <p class="muted">Hands-on in your terminal. Tick each step when you've done it (saved in this browser).</p>
    <ol class="card steps">
      @for (s of steps; track s.id) {
        <li [class.done]="done().includes(s.id)">
          <label class="row"><input type="checkbox" [checked]="done().includes(s.id)" (change)="toggle(s.id)" /> <b>{{ s.title }}</b></label>
          <code>{{ s.cmd }}</code>
          <p class="muted">{{ s.why }}</p>
        </li>
      }
    </ol>
    <p>{{ done().length }} / {{ steps.length }} done</p>
  `,
  styles: `.steps li { margin: 10px 0; } .steps li.done b { text-decoration: line-through; opacity: .7; } code { display: block; margin: 4px 0; }`,
})
export class Page {
  protected readonly steps = STEPS;
  readonly done = signal<string[]>(this.load());
  toggle(id: string) {
    this.done.update(d => (d.includes(id) ? d.filter(x => x !== id) : [...d, id]));
    try { localStorage.setItem(KEY, JSON.stringify(this.done())); } catch { /* private mode */ }
  }
  private load(): string[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
  }
}

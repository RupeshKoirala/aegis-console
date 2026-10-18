import { Component, computed, signal } from '@angular/core';
import { Import, Project, checkBoundaries } from './boundaries';

const PROJECTS: Project[] = [
  { name: 'console', type: 'app', domain: 'shared' },
  { name: 'feature-lists', type: 'feature', domain: 'lists' },
  { name: 'feature-alerts', type: 'feature', domain: 'alerts' },
  { name: 'data-access-lists', type: 'data-access', domain: 'lists' },
  { name: 'data-access-alerts', type: 'data-access', domain: 'alerts' },
  { name: 'ui-badges', type: 'ui', domain: 'shared' },
  { name: 'util-net', type: 'util', domain: 'shared' },
];

@Component({
  selector: 'app-m25-01',
  template: `
    <h1>Architecture boundaries <small class="muted">what Nx's module-boundaries rule enforces</small></h1>
    <div class="row card">
      <select #from>@for (p of projects; track p.name) { <option>{{ p.name }}</option> }</select> imports
      <select #to>@for (p of projects; track p.name) { <option>{{ p.name }}</option> }</select>
      <button (click)="add(from.value, to.value)">Add import</button> <button (click)="imports.set([])">Reset</button>
    </div>
    <ul class="card">@for (i of imports(); track $index) { <li class="mono">{{ i.from }} → {{ i.to }}</li> }</ul>
    <ul class="card">@for (v of violations(); track $index) { <li class="error-text">✗ {{ v.from }} → {{ v.to }} ({{ v.rule }})</li> } @empty { <li>✓ no violations</li> }</ul>
  `,
})
export class Page {
  protected readonly projects = PROJECTS;
  readonly imports = signal<Import[]>([]);
  readonly violations = computed(() => checkBoundaries(PROJECTS, this.imports()));
  add(from: string, to: string) {
    this.imports.update(l => [...l, { from, to }]);
  }
}

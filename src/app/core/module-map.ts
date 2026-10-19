import { Component, computed, input, signal } from '@angular/core';
import { CURRICULUM } from './curriculum';

// Shows public/diagrams/<module>.svg. The module id arrives as route data, bound to the `mod` input
// by withComponentInputBinding(). Rebuild the pictures with `npm run diagrams`.
@Component({
  selector: 'app-module-map',
  template: `
    <h1>{{ mod().toUpperCase() }} map</h1>
    <p class="muted">
      How this chapter's components, services and data connect. Keep it open next to your editor. The same picture is
      embedded in the module README, and <code>LAB.md</code> in the module folder has the debugging and git drills.
    </p>
    @if (missing()) {
      <p class="card">No map for this module yet: it arrives with the next batch of labs.</p>
    } @else {
      <img [src]="'diagrams/' + mod() + '.svg'" [alt]="title() + ' diagram'" (error)="missing.set(true)" />
    }
  `,
  styles: `img { width: 100%; max-width: 1000px; height: auto; display: block; border: 1px solid var(--border); border-radius: 12px; }`,
})
export class ModuleMap {
  readonly mod = input.required<string>();
  protected readonly missing = signal(false);
  protected readonly title = computed(() => CURRICULUM.find(m => m.id === this.mod())?.title ?? this.mod());
}

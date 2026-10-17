import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { loadedChunks } from './chunk-log';

@Component({
  selector: 'app-m14-06',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>Lazy loading <small class="muted">loadChildren · loadComponent · preloading</small></h1>
    <nav class="row"><a routerLink=".">Home</a> · <a routerLink="admin">Admin</a> · <a routerLink="admin/audit">Audit log</a> · <a routerLink="reports">Reports</a></nav>
    <p class="mono chunks">chunks evaluated: {{ chunks().join(', ') || 'none yet' }}</p>
    <section class="card"><router-outlet /></section>
  `,
})
export class Page {
  protected readonly chunks = loadedChunks;
}

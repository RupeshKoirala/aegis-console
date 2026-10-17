import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-m14-01',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Console shell <small class="muted">routes & links</small></h1>
    <nav class="row tabs">
      <a routerLink="overview" routerLinkActive="active" ariaCurrentWhenActive="page">Overview</a>
      <a routerLink="lists" routerLinkActive="active" ariaCurrentWhenActive="page">Lists</a>
      <a routerLink="alerts" routerLinkActive="active" ariaCurrentWhenActive="page">Alerts</a>
      <a routerLink="nope">Broken link</a>
    </nav>
    <section class="card">
      <router-outlet />
    </section>
  `,
  styles: `.tabs a { padding: 6px 12px; border-radius: 6px; } .tabs a.active { background: var(--accent); color: white; }`,
})
export class Page {}

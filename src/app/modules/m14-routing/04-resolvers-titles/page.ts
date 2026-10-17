import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-m14-04',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>Resolved list <small class="muted">resolvers & titles (live API)</small></h1>
    <p class="muted">Start the API with <code>AEGIS_DELAY=1500 npm run api</code> to watch the old page stay up while the resolver runs.</p>
    <p class="row"><a routerLink="lists/1">Partner allow list</a> · <a routerLink="lists/2">Manual blocks</a>
      · <a routerLink="lists/3">Webroot sample</a> · <a routerLink="lists/99">list 99</a></p>
    @if (navigating()) { <div class="progress" role="progressbar">loading…</div> }
    <section class="card"><router-outlet /></section>
  `,
  styles: `.progress { height: 3px; background: var(--accent); animation: grow 1s infinite; font-size: 0; } @keyframes grow { from { width: 0 } to { width: 100% } }`,
})
export class Page {
  /** While a resolver runs the OLD page stays visible. Show progress from the router's currentNavigation signal. */
  private readonly router = inject(Router);
  readonly navigating = computed(() => !!this.router.currentNavigation());
}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-m14-01',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Console shell <small class="muted">routes & links</small></h1>
    <nav class="row tabs">
      <!-- TODO 2: real router links. href="..." reloads the whole app; routerLink doesn't.
           Each link: routerLink="<relative path>" routerLinkActive="active" ariaCurrentWhenActive="page".
           Keep the 4th link pointing at "nope" to see your ** route. -->
      <a href="#">Overview</a> <a href="#">Lists</a> <a href="#">Alerts</a> <a href="#">Broken link</a>
    </nav>
    <section class="card">
      <!-- TODO 3: the outlet the child routes render into -->
    </section>
  `,
  styles: `.tabs a { padding: 6px 12px; border-radius: 6px; } .tabs a.active { background: var(--accent); color: white; }`,
})
export class Page {}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-m27-01',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Investigation workspace <small class="muted">capstone</small></h1>
    <nav class="row tabs">
      <a routerLink="lookup" routerLinkActive="active">Verdict lookup</a>
      <a routerLink="lists/2" routerLinkActive="active">Manual blocks</a>
      <a routerLink="lists/3" routerLinkActive="active">Webroot sample</a>
    </nav>
    <section class="content"><router-outlet /></section>
  `,
  styles: `.tabs a { padding: 6px 12px; border-radius: 6px; } .tabs a.active { background: var(--accent); color: white; } .content { margin-top: 12px; }`,
})
export class Page {}

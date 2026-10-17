import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-m14-03',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>List workspace <small class="muted">nested routes & query params</small></h1>
    <p class="row"><a routerLink="lists/2">Manual blocks</a> · <a routerLink="lists/3">Webroot sample</a>
      · <a routerLink="lists/3/indicators" [queryParams]="{ q: 'phish' }">Webroot, phishing only</a></p>
    <section class="card"><router-outlet /></section>
  `,
})
export class Page {}

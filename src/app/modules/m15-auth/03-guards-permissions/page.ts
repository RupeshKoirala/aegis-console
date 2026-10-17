import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Session } from '../shared/session';

@Component({
  selector: 'app-m15-03',
  imports: [RouterOutlet],
  template: `
    <h1>Guards & permissions</h1>
    <p class="muted">Signed in: {{ session.user()?.email ?? 'nobody' }}. Try /m15/03/console/users as analyst@acme.test, then as admin.</p>
    <section class="card"><router-outlet /></section>
  `,
})
export class Page {
  protected readonly session = inject(Session);
}

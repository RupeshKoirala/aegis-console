import { Component, effect, inject, input } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginBox } from '../shared/login-box';
import { Session } from '../shared/session';
import { LISTS } from '../../../shared/domain/sample-data';
import { Can } from './permissions';

@Component({
  selector: 'app-p-login',
  imports: [LoginBox],
  template: `<h2 class="login">Sign in to continue</h2><aegis-login-box />`,
})
export class PLogin {
  /** ?returnUrl=… bound by input binding. */
  readonly returnUrl = input<string | undefined>();
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  constructor() {
    // TODO 4: once signed in, go to returnUrl (fallback: this exercise's /console). An effect on isAuthenticated does it.
  }
}

@Component({
  selector: 'app-p-console',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="row"><a routerLink="lists">Lists</a> · <a routerLink="users">Users</a>
      <button class="signout" (click)="session.clear()">Sign out</button></nav>
    <router-outlet />
  `,
})
export class PConsole {
  protected readonly session = inject(Session);
}

@Component({
  selector: 'app-p-lists',
  imports: [Can],
  template: `
    <h2>Lists</h2>
    <ul class="card">
      @for (l of lists; track l.id) {
        <li class="row">{{ l.name }}
          <button *aegisCan="'indicator:write'; else readOnly" class="add">+ indicator</button>
          <button *aegisCan="'list:delete'" class="delete danger">Delete list</button>
        </li>
      }
    </ul>
    <ng-template #readOnly><span class="badge ro">read only</span></ng-template>
  `,
})
export class PLists {
  protected readonly lists = LISTS;
}

@Component({ selector: 'app-p-users', template: `<h2 class="users">Users</h2><p>ADMIN only.</p>` })
export class PUsers {}

@Component({ selector: 'app-p-forbidden', imports: [RouterLink], template: `<h2 class="forbidden">403</h2><a routerLink="../console">back</a>` })
export class PForbidden {}

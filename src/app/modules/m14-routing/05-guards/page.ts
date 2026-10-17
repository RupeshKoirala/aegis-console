import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Role } from '../../../shared/domain/models';
import { DemoSession } from './session';

@Component({
  selector: 'app-m14-05',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Guards <small class="muted">canActivate · canMatch · canDeactivate</small></h1>
    <div class="row card">
      <label>Role
        <select [value]="session.role()" (change)="session.role.set($any($event.target).value)">
          @for (r of roles; track r) { <option [value]="r">{{ r }}</option> }
        </select>
      </label>
      <label class="row"><input type="checkbox" [checked]="session.flags()['threatMap']"
        (change)="session.flags.set({ threatMap: $any($event.target).checked })" /> beta: threat map</label>
    </div>
    <nav class="row tabs">
      <a routerLink="lists" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Lists</a>
      <a routerLink="lists/new" routerLinkActive="active">New list</a>
      <a routerLink="admin/users" routerLinkActive="active">User admin</a>
      <a routerLink="threat-map" routerLinkActive="active">Threat map</a>
    </nav>
    <section class="card"><router-outlet /></section>
  `,
  styles: `.tabs a { padding: 4px 10px; } .tabs a.active { border-bottom: 2px solid var(--accent); }`,
})
export class Page {
  protected readonly session = inject(DemoSession);
  protected readonly roles: Role[] = ['ADMIN', 'ANALYST', 'READ_ONLY'];
}

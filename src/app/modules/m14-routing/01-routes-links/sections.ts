// The console sections. Done for you: plain components, the routing is your job.
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ALERTS, LISTS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-overview',
  template: `<h2>Overview</h2><p class="muted">{{ alerts }} open alerts across {{ lists }} lists.</p>`,
})
export class Overview {
  protected readonly alerts = ALERTS.filter(a => a.status !== 'RESOLVED').length;
  protected readonly lists = LISTS.length;
}

@Component({
  selector: 'app-lists',
  template: `<h2>Lists</h2><ul class="card">@for (l of lists; track l.id) { <li class="row">{{ l.name }} <span class="badge">{{ l.kind }}</span></li> }</ul>`,
})
export class Lists {
  protected readonly lists = LISTS;
}

@Component({
  selector: 'app-alerts',
  template: `<h2>Alerts</h2><ul class="card">@for (a of alerts; track a.id) { <li>{{ a.severity }} · {{ a.title }}</li> }</ul>`,
})
export class Alerts {
  protected readonly alerts = ALERTS;
}

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `<h2>404 · no such section</h2><a routerLink="overview">Back to the overview</a>`,
})
export class NotFound {}

import { Component, computed, input } from '@angular/core';
import { Alert, Severity } from '../../../shared/domain/models';

/** Every user-visible string is marked for translation, with a stable custom ID (@@…). */
@Component({
  selector: 'aegis-alert-summary',
  template: `
<!--@@sol-->
    <h2 class="title" i18n="Heading of the alert summary card@@alerts.title">Open alerts</h2>
    <p class="count" i18n="@@alerts.count">{open(), plural, =0 {No open alerts} =1 {One open alert} other {{{open()}} open alerts}}</p>
    <p class="worst" i18n="@@alerts.worst">Highest severity: {worst(), select, CRITICAL {critical} HIGH {high} other {normal}}</p>
    <input class="search" i18n-placeholder="@@alerts.search" placeholder="Search alerts" />
    <p class="hello" i18n="@@alerts.greeting">Hello {{ analyst() }}, here is your queue.</p>
<!--@@stub-->
    <!-- TODO 1: mark every string for translation with i18n="meaning|description@@id" and these IDs:
         title     "Open alerts"                                   @@alerts.title  (add the description "Heading of the alert summary card")
         count     ICU plural on open(): =0 "No open alerts", =1 "One open alert", other "{{ '{' }}{{ '{' }}open(){{ '}' }}{{ '}' }} open alerts"
                   → {open(), plural, =0 {…} =1 {…} other {…}}                @@alerts.count
         worst     "Highest severity: " + ICU select on worst(): CRITICAL "critical", HIGH "high", other "normal"   @@alerts.worst
         search    the input's placeholder: i18n-placeholder="@@alerts.search"
         greeting  "Hello {{ '{' }}{{ '{' }} analyst() {{ '}' }}{{ '}' }}, here is your queue."             @@alerts.greeting
         The CSS classes (title, count, worst, search, hello) must stay. -->
    <h2 class="title">Open alerts</h2>
    <p class="count">{{ open() }} open alerts</p>
    <p class="worst">Highest severity: {{ worst() }}</p>
    <input class="search" placeholder="Search alerts" />
    <p class="hello">Hello {{ analyst() }}, here is your queue.</p>
<!--@@end-->
  `,
})
export class AlertSummary {
  readonly alerts = input.required<Alert[]>();
  readonly analyst = input('analyst');
  readonly open = computed(() => this.alerts().filter(a => a.status !== 'RESOLVED').length);
  readonly worst = computed<Severity | 'NONE'>(() => {
    const order: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
    return order.find(s => this.alerts().some(a => a.status !== 'RESOLVED' && a.severity === s)) ?? 'NONE';
  });
}

/** TODO 2: strings built in TypeScript use the $localize tagged template, with an ID: $localize`:@@id:text`. */
export function statusLabel(status: Alert['status']): string {
//@@sol
  switch (status) {
    case 'NEW': return $localize`:@@alert.status.new:New`;
    case 'TRIAGED': return $localize`:@@alert.status.triaged:Triaged`;
    case 'RESOLVED': return $localize`:@@alert.status.resolved:Resolved`;
  }
//@@stub
  //   NEW → $localize`:@@alert.status.new:New`, TRIAGED → @@alert.status.triaged "Triaged", RESOLVED → @@alert.status.resolved "Resolved"
  return status;
//@@end
}

/** TODO 2: with a placeholder: $localize`:@@alert.assigned:Assigned to ${name}:name:` → "Assigned to ana@…" */
export function assignedLabel(name: string): string {
//@@sol
  return $localize`:@@alert.assigned:Assigned to ${name}:name:`;
//@@stub
  return `Assigned to ${name}`;
//@@end
}

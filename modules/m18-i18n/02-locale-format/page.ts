import { Component, computed, signal } from '@angular/core';
import { ALERTS } from '../../../shared/domain/sample-data';
import { AppLocale, LOCALES, formatCount, formatInZone, registerAegisLocales, relativeTime, sortNames } from './locale-format';

registerAegisLocales();

const ZONES = [{ label: 'Kathmandu', offset: '+0545' }, { label: 'Paris (summer)', offset: '+0200' }, { label: 'New York (summer)', offset: '-0400' }, { label: 'UTC', offset: '+0000' }];
const FEEDS = ['feed 10', 'Émergence', 'feed 2', 'abuse.ch', 'Zeus tracker', 'emerging threats'];

@Component({
  selector: 'app-m18-02',
  template: `
    <h1>Locale formatting <small class="muted">numbers, zones, relative time, sorting</small></h1>
    <div class="row card">
      <label>Locale <select (change)="locale.set($any($event.target).value)">@for (l of locales; track l) { <option>{{ l }}</option> }</select></label>
      <label>Analyst zone <select (change)="zone.set($any($event.target).value)">@for (z of zones; track z.offset) { <option [value]="z.offset">{{ z.label }}</option> }</select></label>
    </div>
    <p class="card">Blocks today: <b>{{ count() }}</b></p>
    <ul class="card">
      @for (a of rows(); track a.id) { <li class="row"><span class="mono">{{ a.when }}</span> <span class="muted">{{ a.ago }}</span> {{ a.title }}</li> }
    </ul>
    <p class="card">Feeds: {{ feeds().join(' · ') }}</p>
  `,
})
export class Page {
  protected readonly locales = LOCALES;
  protected readonly zones = ZONES;
  readonly locale = signal<AppLocale>('en-US');
  readonly zone = signal('+0545');
  private readonly now = new Date('2026-10-15T12:00:00Z');
  readonly count = computed(() => formatCount(1204937, this.locale()));
  readonly rows = computed(() => ALERTS.map(a => ({
    id: a.id, title: a.title,
    when: formatInZone(a.at, this.locale(), this.zone()),
    ago: relativeTime(a.at, this.now, this.locale()),
  })));
  readonly feeds = computed(() => sortNames(FEEDS, this.locale()));
}

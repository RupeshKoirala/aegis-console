import { Component, signal } from '@angular/core';
import { AdvancedFilters, AlertDetails, RelatedFeeds, SAMPLE_ALERTS } from '../widgets';

@Component({
  selector: 'app-m16-02',
  imports: [AlertDetails, RelatedFeeds, AdvancedFilters],
  template: `
    <h1>Alert queue <small class="muted">&#64;defer when · in lists · on timer</small></h1>
    <label class="row"><input type="checkbox" class="toggle-advanced" [checked]="showAdvanced()" (change)="showAdvanced.set(!showAdvanced())" /> Advanced filters</label>
    @defer (when showAdvanced()) {
      <aegis-advanced-filters />
    }

    <ul class="card queue">
      @for (a of alerts; track a.id) {
        <li class="alert-row">
          <div class="row"><span class="badge">{{ a.severity }}</span> {{ a.title }}
            <button #more class="more">details</button></div>
          @defer (on interaction(more)) {
            <aegis-alert-details [alert]="a" />
          } @placeholder {
            <span></span>
          }
        </li>
      }
    </ul>

    @defer (on timer(3s)) {
      <aegis-related-feeds />
    } @placeholder {
      <p class="muted feeds-placeholder">Checking partner feeds…</p>
    }
  `,
  styles: `.alert-row { padding: 8px 0; border-bottom: 1px solid var(--border); list-style: none; } .alert-row .row { justify-content: space-between; }`,
})
export class Page {
  protected readonly alerts = SAMPLE_ALERTS;
  readonly showAdvanced = signal(false);
}

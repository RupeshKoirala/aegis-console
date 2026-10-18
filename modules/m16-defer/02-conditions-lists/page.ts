import { Component, signal } from '@angular/core';
import { AdvancedFilters, AlertDetails, RelatedFeeds, SAMPLE_ALERTS } from '../widgets';

@Component({
  selector: 'app-m16-02',
  imports: [AlertDetails, RelatedFeeds, AdvancedFilters],
  template: `
    <h1>Alert queue <small class="muted">&#64;defer when · in lists · on timer</small></h1>
    <label class="row"><input type="checkbox" class="toggle-advanced" [checked]="showAdvanced()" (change)="showAdvanced.set(!showAdvanced())" /> Advanced filters</label>
<!--@@sol-->
    @defer (when showAdvanced()) {
      <aegis-advanced-filters />
    }
<!--@@stub-->
    <!-- TODO 1: load and show the advanced filters only once the box is ticked: &#64;defer (when showAdvanced()) { … }
         (no placeholder needed: nothing shows until then) -->
    @if (showAdvanced()) { <aegis-advanced-filters /> }
<!--@@end-->

    <ul class="card queue">
      @for (a of alerts; track a.id) {
        <li class="alert-row">
          <div class="row"><span class="badge">{{ a.severity }}</span> {{ a.title }}
            <button #more class="more">details</button></div>
<!--@@sol-->
          @defer (on interaction(more)) {
            <aegis-alert-details [alert]="a" />
          } @placeholder {
            <span></span>
          }
<!--@@stub-->
          <!-- TODO 2: each row loads its own details on a click of ITS "details" button:
               &#64;defer (on interaction(more)) { <aegis-alert-details [alert]="a" /> } &#64;placeholder { <span></span> }
               (interaction/hover/viewport triggers need a placeholder or a template reference to watch) -->
<!--@@end-->
        </li>
      }
    </ul>

<!--@@sol-->
    @defer (on timer(3s)) {
      <aegis-related-feeds />
    } @placeholder {
      <p class="muted feeds-placeholder">Checking partner feeds…</p>
    }
<!--@@stub-->
    <!-- TODO 3: the related-feeds banner 3 seconds after the page renders:
         &#64;defer (on timer(3s)) { <aegis-related-feeds /> } &#64;placeholder { <p class="muted feeds-placeholder">Checking partner feeds…</p> } -->
    <aegis-related-feeds />
<!--@@end-->
  `,
  styles: `.alert-row { padding: 8px 0; border-bottom: 1px solid var(--border); list-style: none; } .alert-row .row { justify-content: space-between; }`,
})
export class Page {
  protected readonly alerts = SAMPLE_ALERTS;
  readonly showAdvanced = signal(false);
}

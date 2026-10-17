import { Component } from '@angular/core';
import { LegacyFeedStatus } from './legacy-feed-status';
import { ThrottledCounter } from './throttled-counter';

@Component({
  selector: 'app-m09-03',
  imports: [LegacyFeedStatus, ThrottledCounter],
  template: `<h1>ChangeDetectorRef</h1><section class="card"><aegis-legacy-feed-status /><aegis-throttled-counter /></section>`,
})
export class Page {}

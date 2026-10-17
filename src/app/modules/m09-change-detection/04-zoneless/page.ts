import { Component } from '@angular/core';
import { FeedHealth } from './feed-health';

@Component({
  selector: 'app-m09-04',
  imports: [FeedHealth],
  template: `<h1>Feed health</h1><section class="card"><aegis-feed-health /></section>
    <p class="muted">DevTools → Network → set "Offline" to fire the offline event.</p>`,
})
export class Page {}

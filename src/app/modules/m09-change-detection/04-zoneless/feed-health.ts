import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';

@Component({
  selector: 'aegis-feed-health',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p class="last-sync">last sync: {{ lastSync }}</p>
    <p class="entries">entries: {{ entries }}</p>
    <p class="online">network: {{ online ? 'online' : 'offline' }}</p>
  `,
})
export class FeedHealth {
  // TODO 1–3: make these three fields signals, write them with .set(), and read them with () in the template
  lastSync = 'never';
  entries = 0;
  online = true;

  constructor() {
    const timer = setTimeout(() => {
      this.lastSync = '12:00 UTC';
    }, 500);

    Promise.resolve(19).then(count => {
      this.entries = count;
    });

    const onOffline = () => (this.online = false);
    window.addEventListener('offline', onOffline);

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(timer);
      window.removeEventListener('offline', onOffline);
    });
  }
}

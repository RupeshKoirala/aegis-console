import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

@Component({
  selector: 'aegis-feed-health',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="last-sync">last sync: {{ lastSync() }}</p>
    <p class="entries">entries: {{ entries() }}</p>
    <p class="online">network: {{ online() ? 'online' : 'offline' }}</p>
  `,
})
export class FeedHealth {
  readonly lastSync = signal('never');
  readonly entries = signal(0);
  readonly online = signal(true);

  constructor() {
    const timer = setTimeout(() => {
      this.lastSync.set('12:00 UTC');
    }, 500);

    Promise.resolve(19).then(count => {
      this.entries.set(count);
    });

    const onOffline = () => this.online.set(false);
    window.addEventListener('offline', onOffline);

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(timer);
      window.removeEventListener('offline', onOffline);
    });
  }
}

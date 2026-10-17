//@@sol
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
//@@stub
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
//@@end

@Component({
  selector: 'aegis-feed-health',
//@@sol
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="last-sync">last sync: {{ lastSync() }}</p>
    <p class="entries">entries: {{ entries() }}</p>
    <p class="online">network: {{ online() ? 'online' : 'offline' }}</p>
  `,
//@@stub
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p class="last-sync">last sync: {{ lastSync }}</p>
    <p class="entries">entries: {{ entries }}</p>
    <p class="online">network: {{ online ? 'online' : 'offline' }}</p>
  `,
//@@end
})
export class FeedHealth {
//@@sol
  readonly lastSync = signal('never');
  readonly entries = signal(0);
  readonly online = signal(true);
//@@stub
  // TODO 1–3: make these three fields signals, write them with .set(), and read them with () in the template
  lastSync = 'never';
  entries = 0;
  online = true;
//@@end

  constructor() {
    const timer = setTimeout(() => {
//@@sol
      this.lastSync.set('12:00 UTC');
//@@stub
      this.lastSync = '12:00 UTC';
//@@end
    }, 500);

    Promise.resolve(19).then(count => {
//@@sol
      this.entries.set(count);
//@@stub
      this.entries = count;
//@@end
    });

//@@sol
    const onOffline = () => this.online.set(false);
//@@stub
    const onOffline = () => (this.online = false);
//@@end
    window.addEventListener('offline', onOffline);

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(timer);
      window.removeEventListener('offline', onOffline);
    });
  }
}

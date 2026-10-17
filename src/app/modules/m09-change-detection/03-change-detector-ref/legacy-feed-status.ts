import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';

/** Gen 1/2 style: plain field updated from a timer inside an OnPush component. */
@Component({
  selector: 'aegis-legacy-feed-status',
  template: `<p class="feed">Webroot feed: <strong>{{ status }}</strong></p>`,
})
export class LegacyFeedStatus implements OnDestroy {
  status = 'syncing…';
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly timer = setTimeout(() => {
    this.status = 'up to date';
    this.cdr.markForCheck();
  }, 1000);

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}

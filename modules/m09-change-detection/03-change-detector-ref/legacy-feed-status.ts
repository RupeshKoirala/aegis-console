//@@sol
import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
//@@stub
import { Component, OnDestroy } from '@angular/core';
//@@end

/** Gen 1/2 style: plain field updated from a timer inside an OnPush component. */
@Component({
  selector: 'aegis-legacy-feed-status',
  template: `<p class="feed">Webroot feed: <strong>{{ status }}</strong></p>`,
})
export class LegacyFeedStatus implements OnDestroy {
  status = 'syncing…';
//@@sol
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly timer = setTimeout(() => {
    this.status = 'up to date';
    this.cdr.markForCheck();
  }, 1000);
//@@stub
  // TODO 1: after the timeout the field changes but nothing re-renders. Inject ChangeDetectorRef
  //         and call markForCheck() right after setting status.
  private readonly timer = setTimeout(() => {
    this.status = 'up to date';
  }, 1000);
//@@end

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}

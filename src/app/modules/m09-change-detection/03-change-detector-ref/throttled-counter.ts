import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';

/** Receives ~50 updates per second; humans can't read faster than ~2 per second. */
@Component({
  selector: 'aegis-throttled-counter',
  template: `<p class="blocked">blocked: <strong>{{ blocked }}</strong></p>`,
})
export class ThrottledCounter {
  blocked = 0;

  constructor() {
    const cdr = inject(ChangeDetectorRef);
    cdr.detach();
    const feed = setInterval(() => this.blocked++, 20);
    const render = setInterval(() => cdr.detectChanges(), 500);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(feed);
      clearInterval(render);
    });
  }
}

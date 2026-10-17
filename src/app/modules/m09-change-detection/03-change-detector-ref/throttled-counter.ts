import { Component, DestroyRef, inject } from '@angular/core';

/** Receives ~50 updates per second; humans can't read faster than ~2 per second. */
@Component({
  selector: 'aegis-throttled-counter',
  template: `<p class="blocked">blocked: <strong>{{ blocked }}</strong></p>`,
})
export class ThrottledCounter {
  blocked = 0;

  constructor() {
    // TODO 2: inject ChangeDetectorRef and detach() it, so Angular stops checking this component automatically
    const feed = setInterval(() => this.blocked++, 20);
    // TODO 3: render manually every 500 ms with cdr.detectChanges(), in a second interval cleared on destroy
    const render = setInterval(() => {}, 500);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(feed);
      clearInterval(render);
    });
  }
}

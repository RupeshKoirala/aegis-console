//@@sol
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
//@@stub
import { Component, DestroyRef, inject } from '@angular/core';
//@@end

/** Receives ~50 updates per second; humans can't read faster than ~2 per second. */
@Component({
  selector: 'aegis-throttled-counter',
  template: `<p class="blocked">blocked: <strong>{{ blocked }}</strong></p>`,
})
export class ThrottledCounter {
  blocked = 0;

  constructor() {
//@@sol
    const cdr = inject(ChangeDetectorRef);
    cdr.detach();
    const feed = setInterval(() => this.blocked++, 20);
    const render = setInterval(() => cdr.detectChanges(), 500);
//@@stub
    // TODO 2: inject ChangeDetectorRef and detach() it, so Angular stops checking this component automatically
    const feed = setInterval(() => this.blocked++, 20);
    // TODO 3: render manually every 500 ms with cdr.detectChanges(), in a second interval cleared on destroy
    const render = setInterval(() => {}, 500);
//@@end
    inject(DestroyRef).onDestroy(() => {
      clearInterval(feed);
      clearInterval(render);
    });
  }
}

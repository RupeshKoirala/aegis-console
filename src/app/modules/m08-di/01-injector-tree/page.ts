import { Component, inject } from '@angular/core';
import { CounterService, RootCounter } from './counter.service';
import { SharedCounter } from './shared-counter';
import { IsolatedCounter } from './isolated-counter';

@Component({
  selector: 'app-m08-01',
  imports: [SharedCounter, IsolatedCounter],
  // TODO 2: provide ONE CounterService here so both <aegis-shared-counter>s share it:  providers: [CounterService]
  template: `
    <h1>Injector tree</h1>
    <section class="card shared"><h3>Shared (provided by the page)</h3>
      <aegis-shared-counter label="Edge FW 1" /> <aegis-shared-counter label="Edge FW 2" />
    </section>
    <section class="card isolated"><h3>Isolated (provided by each component)</h3>
      <aegis-isolated-counter label="Tenant A" /> <aegis-isolated-counter label="Tenant B" />
    </section>
    <section class="card"><h3>Root (providedIn: 'root')</h3>
      <button class="root" (click)="root.increment()">app-wide: {{ root.count() }}</button>
      <p class="muted">Navigate away and come back: this number survives, the others reset.</p>
    </section>
  `,
  styles: `section { margin-bottom: 14px; } h3 { margin-top: 0; }`,
})
export class Page {
  protected readonly root = inject(RootCounter);
}

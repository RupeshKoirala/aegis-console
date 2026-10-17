import { Component, inject, input } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'aegis-isolated-counter',
  providers: [CounterService],
  template: `<button class="inc" (click)="counter.increment()">{{ label() }}: {{ counter.count() }} <small>#{{ counter.id }}</small></button>`,
})
export class IsolatedCounter {
  readonly label = input('isolated');
  protected readonly counter = inject(CounterService);
}

import { Component, inject, input } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'aegis-isolated-counter',
//@@sol
  providers: [CounterService],
//@@stub
  // TODO 1: give every instance of this component its OWN CounterService:  providers: [CounterService]
//@@end
  template: `<button class="inc" (click)="counter.increment()">{{ label() }}: {{ counter.count() }} <small>#{{ counter.id }}</small></button>`,
})
export class IsolatedCounter {
  readonly label = input('isolated');
  protected readonly counter = inject(CounterService);
}

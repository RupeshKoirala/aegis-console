import { Component, inject, input } from '@angular/core';
import { CounterService } from './counter.service';

/** Provides nothing itself, so it uses whatever instance an ancestor provides. */
@Component({
  selector: 'aegis-shared-counter',
  template: `<button class="inc" (click)="counter.increment()">{{ label() }}: {{ counter.count() }} <small>#{{ counter.id }}</small></button>`,
})
export class SharedCounter {
  readonly label = input('shared');
  protected readonly counter = inject(CounterService);
}

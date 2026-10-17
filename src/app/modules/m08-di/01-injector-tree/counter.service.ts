import { Injectable, signal } from '@angular/core';

let created = 0;
/** Not providedIn root on purpose: whoever provides it decides how many instances exist. */
@Injectable()
export class CounterService {
  readonly id = ++created;
  readonly count = signal(0);
  increment() {
    this.count.update(c => c + 1);
  }
}

@Injectable({ providedIn: 'root' })
export class RootCounter {
  readonly count = signal(0);
  increment() {
    this.count.update(c => c + 1);
  }
}

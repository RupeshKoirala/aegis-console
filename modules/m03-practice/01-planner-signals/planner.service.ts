//@@sol
import { Injectable, computed, signal } from '@angular/core';
//@@stub
import { Injectable, computed } from '@angular/core';
//@@end
import { PlannerInput, project } from './projection';

@Injectable({ providedIn: 'root' })
export class PlannerService {
//@@sol
  private readonly input = signal<PlannerInput | null>(null);
  readonly lastInput = this.input.asReadonly();
  readonly rows = computed(() => {
    const i = this.input();
    return i ? project(i) : [];
  });

  plan(input: PlannerInput) {
    this.input.set(input);
  }
//@@stub
  // TODO 2: a private writable signal holding the last submitted PlannerInput (or null), exposed read-only as `lastInput`
  readonly lastInput = computed<PlannerInput | null>(() => null);

  // TODO 3a: rows = computed: [] when there is no input yet, otherwise project(input)
  readonly rows = computed(() => [] as ReturnType<typeof project>);

  plan(input: PlannerInput) {
    // TODO 3b: store the input
  }
//@@end
}

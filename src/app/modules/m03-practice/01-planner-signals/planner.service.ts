import { Injectable, computed } from '@angular/core';
import { PlannerInput, project } from './projection';

@Injectable({ providedIn: 'root' })
export class PlannerService {
  // TODO 2: a private writable signal holding the last submitted PlannerInput (or null), exposed read-only as `lastInput`
  readonly lastInput = computed<PlannerInput | null>(() => null);

  // TODO 3a: rows = computed: [] when there is no input yet, otherwise project(input)
  readonly rows = computed(() => [] as ReturnType<typeof project>);

  plan(input: PlannerInput) {
    // TODO 3b: store the input
  }
}

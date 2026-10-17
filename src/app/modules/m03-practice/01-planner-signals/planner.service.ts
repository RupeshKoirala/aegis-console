import { Injectable, computed, signal } from '@angular/core';
import { PlannerInput, project } from './projection';

@Injectable({ providedIn: 'root' })
export class PlannerService {
  private readonly input = signal<PlannerInput | null>(null);
  readonly lastInput = this.input.asReadonly();
  readonly rows = computed(() => {
    const i = this.input();
    return i ? project(i) : [];
  });

  plan(input: PlannerInput) {
    this.input.set(input);
  }
}

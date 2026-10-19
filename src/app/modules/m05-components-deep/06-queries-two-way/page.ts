import { Component, computed, signal } from '@angular/core';
import { TagInput } from './tag-input';
import { LegacyTagInput } from './legacy-tag-input';

@Component({
  selector: 'app-m05-06',
  imports: [TagInput, LegacyTagInput],
  template: `
    <h1>Label an indicator</h1>
    <p class="mono">203.0.113.66</p>
    <!-- TODO 1b: after TODO 1, bind two-way:  [(tags)]="labels" -->
    <aegis-tag-input />
    <p class="parent-view">Parent sees: {{ summary() }}</p>
    <div class="row">
      <button class="focus" (click)="focusInput()">Focus tag input</button>
      <button class="reset" (click)="labels.set([])">Reset from parent</button>
    </div>
    <h3>Gen 1 version</h3>
    <!-- TODO 5b: after TODO 5:  [(tags)]="legacyLabels" -->
    <aegis-legacy-tag-input />
    <p class="legacy-view">Parent sees: {{ legacyLabels.join(', ') }}</p>
  `,
})
export class Page {
  readonly labels = signal<string[]>(['botnet']);
  /** Derived in the parent: it only updates when `labels` receives a NEW array. */
  protected readonly summary = computed(() => this.labels().join(', ') || '—');
  legacyLabels: string[] = ['scanner'];
  // TODO 6: query the child COMPONENT (viewChild.required(TagInput)) and call its focus() here
  focusInput() {}
}

//@@sol
import { Component, signal, viewChild } from '@angular/core';
//@@stub
import { Component, signal } from '@angular/core';
//@@end
import { TagInput } from './tag-input';
import { LegacyTagInput } from './legacy-tag-input';

@Component({
  selector: 'app-m05-06',
  imports: [TagInput, LegacyTagInput],
  template: `
    <h1>Label an indicator</h1>
    <p class="mono">203.0.113.66</p>
<!--@@sol-->
    <aegis-tag-input [(tags)]="labels" />
<!--@@stub-->
    <!-- TODO 1b: after TODO 1, bind two-way:  [(tags)]="labels" -->
    <aegis-tag-input />
<!--@@end-->
    <p class="parent-view">Parent sees: {{ labels().join(', ') || '—' }}</p>
    <div class="row">
      <button class="focus" (click)="focusInput()">Focus tag input</button>
      <button class="reset" (click)="labels.set([])">Reset from parent</button>
    </div>
    <h3>Gen 1 version</h3>
<!--@@sol-->
    <aegis-legacy-tag-input [(tags)]="legacyLabels" />
<!--@@stub-->
    <!-- TODO 5b: after TODO 5:  [(tags)]="legacyLabels" -->
    <aegis-legacy-tag-input />
<!--@@end-->
    <p class="legacy-view">Parent sees: {{ legacyLabels.join(', ') }}</p>
  `,
})
export class Page {
  readonly labels = signal<string[]>(['botnet']);
  legacyLabels: string[] = ['scanner'];
//@@sol
  private readonly tagInput = viewChild.required(TagInput);

  focusInput() {
    this.tagInput().focus();
  }
//@@stub
  // TODO 6: query the child COMPONENT (viewChild.required(TagInput)) and call its focus() here
  focusInput() {}
//@@end
}

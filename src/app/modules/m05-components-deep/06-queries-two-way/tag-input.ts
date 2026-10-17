import { Component, ElementRef, computed, signal } from '@angular/core';

@Component({
  selector: 'aegis-tag-input',
  template: `
    <div class="tags" (click)="focus()">
      @for (t of tags(); track t) {
        <span #chip class="chip">{{ t }} <button class="x" (click)="remove(t); $event.stopPropagation()">✕</button></span>
      }
      <input #entry class="entry" placeholder="add a tag…" (keydown.enter)="add(entry.value)" />
    </div>
    <p class="muted count">{{ chipCount() }} tags</p>
  `,
  styles: `.tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); } .chip { background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: 2px 4px 2px 10px; font-size: 13px; } .x { border: 0; background: none; padding: 0 4px; } .entry { border: 0; background: transparent; flex: 1; min-width: 120px; outline: none; } .count { font-size: 12px; margin: 4px 0 0; }`,
})
export class TagInput {
  // TODO 1: make tags two-way bindable:  model<string[]>([])
  readonly tags = signal<string[]>([]);
  // TODO 2: query the #entry input (viewChild.required<ElementRef<HTMLInputElement>>('entry'))
  //         and all #chip spans (viewChildren<ElementRef<HTMLElement>>('chip'));
  //         chipCount = computed number of chip ELEMENTS found by the query
  readonly chipCount = computed(() => 0);

  add(raw: string) {
    // TODO 3: trim + lower-case, ignore empty/duplicates, append immutably, then clear the input's value via the query
  }

  remove(tag: string) {
    // TODO 3b
  }

  focus() {
    // TODO 4: focus the input through the viewChild query
  }
}

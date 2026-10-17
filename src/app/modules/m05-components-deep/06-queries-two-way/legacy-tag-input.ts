import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Gen 1 two-way binding: @Input() tags + @Output() tagsChange. */
@Component({
  selector: 'aegis-legacy-tag-input',
  template: `
    <div class="row">
      @for (t of tags; track t) { <span class="chip legacy-chip">{{ t }}</span> }
      <button class="add-urgent" (click)="add('urgent')">+ urgent</button>
    </div>
  `,
  styles: `.chip { border: 1px dashed var(--border); border-radius: 999px; padding: 2px 10px; font-size: 13px; }`,
})
export class LegacyTagInput {
  @Input() tags: string[] = [];
  @Output() tagsChange = new EventEmitter<string[]>();

  add(tag: string) {
    if (!this.tags.includes(tag)) this.tagsChange.emit([...this.tags, tag]);
  }
}

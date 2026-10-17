import { Component, Input } from '@angular/core';

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
  // TODO 5: the Gen 1 two-way pair: add @Output() tagsChange = new EventEmitter<string[]>()
  //         and in add() EMIT the new array (don't mutate this.tags. The parent owns it!)
  add(tag: string) {}
}

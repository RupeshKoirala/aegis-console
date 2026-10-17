import { Component, TemplateRef, input } from '@angular/core';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';

export interface RowContext<T> {
  $implicit: T;
  index: number;
}

@Component({
  selector: 'aegis-smart-table',
  imports: [NgTemplateOutlet, JsonPipe],
  templateUrl: './smart-table.html',
  styles: `table { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 20px; } .empty { color: var(--muted); text-align: center; padding: 24px; }`,
})
export class SmartTable<T> {
  readonly caption = input('');
  readonly rows = input.required<readonly T[]>();
  readonly rowTemplate = input<TemplateRef<RowContext<T>>>();
  readonly emptyTemplate = input<TemplateRef<unknown>>();
}

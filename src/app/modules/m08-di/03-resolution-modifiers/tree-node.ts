import { Component, Signal, computed, inject, input } from '@angular/core';

@Component({
  selector: 'aegis-tree-node',
  template: `
    <div class="node" [style.padding-left.px]="depth() * 18">
      <span class="name">{{ name() }}</span> <small class="muted path">{{ path() }}</small> <small class="depth">d{{ depth() }}</small>
    </div>
    <ng-content />
  `,
  styles: `.node { padding: 4px 0; } .depth { color: var(--accent-2); }`,
})
export class TreeNode {
  readonly name = input.required<string>();
  private readonly parent: TreeNode | null = inject(TreeNode, { skipSelf: true, optional: true });
  readonly depth: Signal<number> = computed(() => (this.parent ? this.parent.depth() + 1 : 0));
  readonly path: Signal<string> = computed(() => (this.parent ? `${this.parent.path()} / ${this.name()}` : this.name()));
}

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
  // TODO 1: inject the PARENT TreeNode: skip yourself, and allow "none" for the root:
  //         private readonly parent: TreeNode | null = inject(TreeNode, { skipSelf: true, optional: true })
  //         (the explicit type is needed because a class referring to itself confuses inference)
  // TODO 2: depth = 0 for the root, otherwise parent.depth() + 1
  readonly depth = computed<number>(() => 0);
  // TODO 3: path = "Shieldline MSP / Acme Schools / Main campus" (the parent's path + " / " + name)
  readonly path = computed<string>(() => this.name());
}

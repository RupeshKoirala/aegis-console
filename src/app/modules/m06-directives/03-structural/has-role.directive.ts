import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { Role } from '../../../shared/domain/models';
import { CurrentUser } from './current-user';

export interface HasRoleContext {
  $implicit: Role;
}

@Directive({ selector: '[aegisHasRole]' })
export class HasRole {
  private readonly tpl = inject<TemplateRef<HasRoleContext>>(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly user = inject(CurrentUser);

  readonly roles = input.required<Role | Role[]>({ alias: 'aegisHasRole' });
  readonly elseTemplate = input<TemplateRef<unknown> | null>(null, { alias: 'aegisHasRoleElse' });

  private rendered: 'main' | 'else' | 'none' | null = null;

  constructor() {
    effect(() => {
      const role = this.user.role();
      const allowed = [this.roles()].flat().includes(role);
      const next = allowed ? 'main' : this.elseTemplate() ? 'else' : 'none';
      if (next === this.rendered && next !== 'main') return;
      this.vcr.clear();
      if (next === 'main') this.vcr.createEmbeddedView(this.tpl, { $implicit: role });
      if (next === 'else') this.vcr.createEmbeddedView(this.elseTemplate()!);
      this.rendered = next;
    });
  }

  static ngTemplateContextGuard(_dir: HasRole, ctx: unknown): ctx is HasRoleContext {
    return true;
  }
}

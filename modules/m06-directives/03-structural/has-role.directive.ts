//@@sol
import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
//@@stub
import { TemplateRef } from '@angular/core';
//@@end
import { Role } from '../../../shared/domain/models';
//@@sol
import { CurrentUser } from './current-user';
//@@end

export interface HasRoleContext {
  $implicit: Role;
}

//@@sol
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
//@@stub
// TODO 1: @Directive({ selector: '[aegisHasRole]' })
export class HasRole {
  // TODO 2: inject TemplateRef<HasRoleContext>, ViewContainerRef and CurrentUser (from './current-user')
  // TODO 3: two inputs whose PUBLIC names match the micro-syntax:
  //   roles        → input.required<Role | Role[]>({ alias: 'aegisHasRole' })
  //   elseTemplate → input<TemplateRef<unknown> | null>(null, { alias: 'aegisHasRoleElse' })
  // TODO 4: in the constructor, an effect():
  //   allowed = [this.roles()].flat().includes(user.role())
  //   clear the container; if allowed → createEmbeddedView(tpl, { $implicit: role });
  //   else if there is an else template → createEmbeddedView(elseTemplate)
  // TODO 5: add the type guard so `let role` is typed:
  //   static ngTemplateContextGuard(_dir: HasRole, ctx: unknown): ctx is HasRoleContext { return true; }
}
export type _Unused = TemplateRef<HasRoleContext> | Role;
//@@end

import { TemplateRef } from '@angular/core';
import { Role } from '../../../shared/domain/models';

export interface HasRoleContext {
  $implicit: Role;
}

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

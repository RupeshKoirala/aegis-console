import { Directive, Injectable, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { Role } from '../../../shared/domain/models';
import { Session } from '../shared/session';

/** Done for you: the permission matrix. The API enforces the same table (requireRole in api/server.cjs). */
export const PERMISSIONS = {
  'indicator:write': ['ADMIN', 'ANALYST'],
  'alert:triage': ['ADMIN', 'ANALYST'],
  'list:delete': ['ADMIN'],
  'user:manage': ['ADMIN'],
} as const satisfies Record<string, readonly Role[]>;
export type Permission = keyof typeof PERMISSIONS;

@Injectable({ providedIn: 'root' })
export class Permissions {
  private readonly session = inject(Session);

  /** TODO 1: true when the signed-in user's role is listed for `p`. Read the role SIGNAL so callers stay reactive. */
  allows(p: Permission): boolean {
    return true;
  }
}

/**
 * TODO 3: `*aegisCan="'list:delete'; else readOnly"`: render the template only when allowed, otherwise the
 * optional else-template. Re-render when the role changes (an effect), but don't recreate views when the
 * outcome is unchanged. (M06.03 built *hasRole the Gen 2 way; this is the signal version.)
 */
@Directive({ selector: '[aegisCan]' })
export class Can {
  readonly aegisCan = input.required<Permission>();
  readonly aegisCanElse = input<TemplateRef<unknown> | null>(null);
  private readonly tpl = inject(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly permissions = inject(Permissions);
  constructor() {
  }
}

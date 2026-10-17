import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, CanMatchFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Role } from '../../../shared/domain/models';
import { ConfirmService, DemoSession } from './session';

/** Done for you: a URL inside this exercise, e.g. ('/m14/05/admin/users', 'forbidden') → /m14/05/forbidden. */
export function featureUrl(router: Router, state: RouterStateSnapshot, path: string): UrlTree {
  return router.parseUrl(state.url.split('?')[0].split('/').slice(0, 3).join('/') + '/' + path);
}

/** TODO 1: a guard FACTORY. Allowed role → true; otherwise redirect to featureUrl(router, state, 'forbidden'). */
export function requireRole(...roles: Role[]): CanActivateFn {
  return (_route, state) => {
    if (roles.includes(inject(DemoSession).role())) return true;
    const router = inject(Router);
    return featureUrl(router, state, 'forbidden');
  };
}

/** TODO 2: CanMatch: the route only EXISTS while the flag is on (false → the router tries the next route). */
export function featureFlag(name: string): CanMatchFn {
  return () => {
    return inject(DemoSession).flags()[name] === true;
  };
}

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/** TODO 3: leaving a component with unsaved changes asks ConfirmService.ask('Discard unsaved changes?'). */
export const unsavedChanges: CanDeactivateFn<HasUnsavedChanges> = component => {
  return !component.hasUnsavedChanges() || inject(ConfirmService).ask('Discard unsaved changes?');
};

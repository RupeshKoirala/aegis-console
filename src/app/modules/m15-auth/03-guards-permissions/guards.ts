import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Session } from '../shared/session';
import { Permission, Permissions } from './permissions';

/** Done for you (same helper as M14.05): a URL inside this exercise, e.g. /m15/03/login. */
export function featureUrl(router: Router, state: RouterStateSnapshot, path: string, queryParams?: Record<string, string>): UrlTree {
  const tree = router.parseUrl(state.url.split('?')[0].split('/').slice(0, 3).join('/') + '/' + path);
  if (queryParams) tree.queryParams = queryParams;
  return tree;
}

/** TODO 2a: signed in → true. Otherwise → the 'login' page with ?returnUrl=<the url they wanted>. */
export const authGuard: CanActivateFn = (_route, state) => {
  return true;
};

/** TODO 2b: a factory: allowed → true, otherwise → 'forbidden'. */
export function requirePermission(p: Permission): CanActivateFn {
  return (_route, state) => {
    return true;
  };
}

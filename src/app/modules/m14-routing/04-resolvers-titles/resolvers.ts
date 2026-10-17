import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, map, of, throwError } from 'rxjs';
import { ListsApi } from './lists-api';
import { ListView } from '../../../shared/domain/models';

/**
 * TODO 1: resolve the list BEFORE the page renders (no spinner-then-flash inside the page).
 *  - id = Number(route.paramMap.get('listId'))
 *  - a 404 → return new RedirectCommand(<UrlTree for the sibling 'not-found' route>). Build it from state.url:
 *    router.parseUrl(state.url.replace(/lists\/[^/]+$/, 'not-found'))
 *  - any other error → rethrow (the navigation fails; a global handler shows it)
 */
export const listResolver: ResolveFn<ListView> = (route, state) => {
  const router = inject(Router);
  return inject(ListsApi).get(Number(route.paramMap.get('listId'))).pipe(
    catchError((err: HttpErrorResponse) =>
      err.status === 404 ? of(new RedirectCommand(router.parseUrl(state.url.replace(/lists\/[^/]+$/, 'not-found')))) : throwError(() => err)),
  );
};

/** TODO 2: the tab title, e.g. "Manual blocks · Lists". Use the same ListsApi.get (TODO 3 makes it one request). */
export const listTitle: ResolveFn<string> = route => {
  return inject(ListsApi).get(Number(route.paramMap.get('listId'))).pipe(map(l => `${l.name} · Lists`), catchError(() => of('Lists')));
};

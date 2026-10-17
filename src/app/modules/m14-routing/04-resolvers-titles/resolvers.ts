import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { ListView } from '../../../shared/domain/models';

/**
 * TODO 1: resolve the list BEFORE the page renders (no spinner-then-flash inside the page).
 *  - id = Number(route.paramMap.get('listId'))
 *  - a 404 → return new RedirectCommand(<UrlTree for the sibling 'not-found' route>). Build it from state.url:
 *    router.parseUrl(state.url.replace(/lists\/[^/]+$/, 'not-found'))
 *  - any other error → rethrow (the navigation fails; a global handler shows it)
 */
export const listResolver: ResolveFn<ListView> = (route, state) => {
  return of({ id: 0, name: '?', kind: 'BLOCK', description: null, indicatorCount: 0, createdAt: '' } as ListView);
};

/** TODO 2: the tab title, e.g. "Manual blocks · Lists". Use the same ListsApi.get (TODO 3 makes it one request). */
export const listTitle: ResolveFn<string> = route => {
  return 'Lists';
};

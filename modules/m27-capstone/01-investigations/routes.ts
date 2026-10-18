import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { ListView } from '../../../shared/domain/models';
import { InvestigationApi } from './investigation.api';
import { LookupPage } from './lookup.page';
import { ListPage } from './list.page';

export const BASE = '/m27/01';

/** R7: load the list before the page; a 404 (or a list of another tenant) → back to the lookup page. */
export const listResolver: ResolveFn<ListView> = route => {
//@@sol
  const router = inject(Router);
  return inject(InvestigationApi).list(Number(route.paramMap.get('listId'))).pipe(
    catchError((e: HttpErrorResponse) => (e.status === 404 ? of(new RedirectCommand(router.parseUrl(`${BASE}/lookup`))) : throwError(() => e))),
  );
//@@stub
  return new RedirectCommand(inject(Router).parseUrl(`${BASE}/lookup`));
//@@end
};

/** R7: '' → 'lookup' · 'lookup' (title "Verdict lookup") · 'lists/:listId' (listResolver, title "List") · '**' → 'lookup' */
export const INVESTIGATION_ROUTES: Routes = [
//@@sol
  { path: '', redirectTo: 'lookup', pathMatch: 'full' },
  { path: 'lookup', component: LookupPage, title: 'Verdict lookup' },
  { path: 'lists/:listId', component: ListPage, resolve: { list: listResolver }, title: 'List' },
  { path: '**', redirectTo: 'lookup' },
//@@stub
  { path: '**', component: LookupPage },
//@@end
];

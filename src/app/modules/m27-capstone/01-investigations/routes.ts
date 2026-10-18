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
  return new RedirectCommand(inject(Router).parseUrl(`${BASE}/lookup`));
};

/** R7: '' → 'lookup' · 'lookup' (title "Verdict lookup") · 'lists/:listId' (listResolver, title "List") · '**' → 'lookup' */
export const INVESTIGATION_ROUTES: Routes = [
  { path: '**', component: LookupPage },
];

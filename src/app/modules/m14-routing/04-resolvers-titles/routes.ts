import { Routes } from '@angular/router';
import { ListNotFound, ResolvedList } from './pages';
import { listResolver, listTitle } from './resolvers';

export const RESOLVED_ROUTES: Routes = [
  { path: '', redirectTo: 'lists/2', pathMatch: 'full' },
  { path: 'lists/:listId', component: ResolvedList, resolve: { list: listResolver }, title: listTitle },
  { path: 'not-found', component: ListNotFound, title: 'Not found' },
];

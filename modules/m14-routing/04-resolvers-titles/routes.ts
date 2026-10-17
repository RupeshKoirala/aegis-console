import { Routes } from '@angular/router';
import { ListNotFound, ResolvedList } from './pages';
//@@sol
import { listResolver, listTitle } from './resolvers';
//@@end

export const RESOLVED_ROUTES: Routes = [
  { path: '', redirectTo: 'lists/2', pathMatch: 'full' },
//@@sol
  { path: 'lists/:listId', component: ResolvedList, resolve: { list: listResolver }, title: listTitle },
//@@stub
  // TODO 4: add resolve: { list: listResolver } and title: listTitle to this route
  { path: 'lists/:listId', component: ResolvedList },
//@@end
  { path: 'not-found', component: ListNotFound, title: 'Not found' },
];

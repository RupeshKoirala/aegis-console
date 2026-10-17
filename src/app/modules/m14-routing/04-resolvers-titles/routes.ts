import { Routes } from '@angular/router';
import { ListNotFound, ResolvedList } from './pages';

export const RESOLVED_ROUTES: Routes = [
  { path: '', redirectTo: 'lists/2', pathMatch: 'full' },
  // TODO 4: add resolve: { list: listResolver } and title: listTitle to this route
  { path: 'lists/:listId', component: ResolvedList },
  { path: 'not-found', component: ListNotFound, title: 'Not found' },
];

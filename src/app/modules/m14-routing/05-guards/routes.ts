import { Routes } from '@angular/router';
import { GComingSoon, GForbidden, GLists, GNewList, GThreatMap, GUsers } from './sections';

/**
 * TODO 4: protect the routes
 *   admin/users  canActivate: requireRole('ADMIN')
 *   threat-map   TWO routes with the same path: the first (GThreatMap) has canMatch: featureFlag('threatMap'),
 *                the second (GComingSoon) has no guard. When the flag is off the router falls through to it.
 *   lists/new    canDeactivate: unsavedChanges
 */
export const GUARDED_ROUTES: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: GLists },
  { path: 'lists/new', component: GNewList },
  { path: 'admin/users', component: GUsers },
  { path: 'threat-map', component: GThreatMap },
  { path: 'threat-map/soon', component: GComingSoon },
  { path: 'forbidden', component: GForbidden },
];

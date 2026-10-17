import { Routes } from '@angular/router';
import { GComingSoon, GForbidden, GLists, GNewList, GThreatMap, GUsers } from './sections';
import { featureFlag, requireRole, unsavedChanges } from './guards';

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
  { path: 'lists/new', component: GNewList, canDeactivate: [unsavedChanges] },
  { path: 'admin/users', component: GUsers, canActivate: [requireRole('ADMIN')] },
  { path: 'threat-map', component: GThreatMap, canMatch: [featureFlag('threatMap')] },
  { path: 'threat-map', component: GComingSoon },
  { path: 'forbidden', component: GForbidden },
];

import { Routes } from '@angular/router';
import { PConsole, PForbidden, PLists, PLogin, PUsers } from './pages';
//@@sol
import { authGuard, requirePermission } from './guards';
//@@end

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'console', pathMatch: 'full' },
  { path: 'login', component: PLogin },
  { path: 'forbidden', component: PForbidden },
  {
    path: 'console',
    component: PConsole,
//@@sol
    canActivate: [authGuard],
    canActivateChild: [authGuard],
//@@stub
    // TODO 2c: authGuard on this route AND its children (canActivate + canActivateChild):
    //          signing out while on /console/lists must bounce on the next navigation.
//@@end
    children: [
      { path: '', redirectTo: 'lists', pathMatch: 'full' },
      { path: 'lists', component: PLists },
//@@sol
      { path: 'users', component: PUsers, canActivate: [requirePermission('user:manage')] },
//@@stub
      // TODO 2d: users requires the 'user:manage' permission
      { path: 'users', component: PUsers },
//@@end
    ],
  },
];

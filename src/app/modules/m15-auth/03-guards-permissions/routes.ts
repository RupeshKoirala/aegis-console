import { Routes } from '@angular/router';
import { PConsole, PForbidden, PLists, PLogin, PUsers } from './pages';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'console', pathMatch: 'full' },
  { path: 'login', component: PLogin },
  { path: 'forbidden', component: PForbidden },
  {
    path: 'console',
    component: PConsole,
    // TODO 2c: authGuard on this route AND its children (canActivate + canActivateChild):
    //          signing out while on /console/lists must bounce on the next navigation.
    children: [
      { path: '', redirectTo: 'lists', pathMatch: 'full' },
      { path: 'lists', component: PLists },
      // TODO 2d: users requires the 'user:manage' permission
      { path: 'users', component: PUsers },
    ],
  },
];

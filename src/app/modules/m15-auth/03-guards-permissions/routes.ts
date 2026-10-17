import { Routes } from '@angular/router';
import { PConsole, PForbidden, PLists, PLogin, PUsers } from './pages';
import { authGuard, requirePermission } from './guards';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'console', pathMatch: 'full' },
  { path: 'login', component: PLogin },
  { path: 'forbidden', component: PForbidden },
  {
    path: 'console',
    component: PConsole,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'lists', pathMatch: 'full' },
      { path: 'lists', component: PLists },
      { path: 'users', component: PUsers, canActivate: [requirePermission('user:manage')] },
    ],
  },
];

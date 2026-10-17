import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({ selector: 'app-lazy-home', template: `<p class="home muted">Pick a section. Watch the chunk log and the Network tab.</p>` })
class LazyHome {}

/**
 * TODO 1: nothing below may be imported statically, or it ends up in the main bundle.
 *   'admin'   → loadChildren: () => import('./admin/admin.routes')    (default export, no .then needed), data: { preload: true }
 *   'reports' → loadComponent: () => import('./reports')
 */
export const LAZY_ROUTES: Routes = [
  { path: '', component: LazyHome },
//@@sol
  { path: 'admin', loadChildren: () => import('./admin/admin.routes'), data: { preload: true } },
  { path: 'reports', loadComponent: () => import('./reports') },
//@@end
];

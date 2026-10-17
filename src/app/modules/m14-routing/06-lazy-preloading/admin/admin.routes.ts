import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { markLoaded } from '../chunk-log';

markLoaded('admin.routes');

@Component({ selector: 'app-admin-home', template: `<h2 class="admin">Admin</h2><p class="muted">This came from a lazy chunk.</p>` })
class AdminHome {}

/** A lazily loaded route CONFIG. `export default` lets loadChildren skip the .then(m => m.X). */
export default [
  { path: '', component: AdminHome },
  { path: 'audit', loadComponent: () => import('./audit-log') },
] satisfies Routes;

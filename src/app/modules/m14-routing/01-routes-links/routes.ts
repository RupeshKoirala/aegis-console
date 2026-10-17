import { Routes } from '@angular/router';
import { Alerts, Lists, NotFound, Overview } from './sections';

/**
 * Mounted under /m14/01 (see ../module.ts), so these paths are RELATIVE: 'lists' means /m14/01/lists.
 * TODO 1: ''         → redirect to 'overview' (pathMatch: 'full'!)
 *         'overview' → Overview,  'lists' → Lists,  'alerts' → Alerts   (each with a title: "Overview", "Lists", "Alerts")
 *         '**'       → NotFound (last: routes match in order)
 */
export const SECTION_ROUTES: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: Overview, title: 'Overview' },
  { path: 'lists', component: Lists, title: 'Lists' },
  { path: 'alerts', component: Alerts, title: 'Alerts' },
  { path: '**', component: NotFound, title: 'Not found' },
];

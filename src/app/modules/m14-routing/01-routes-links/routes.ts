import { Routes } from '@angular/router';

/**
 * Mounted under /m14/01 (see ../module.ts), so these paths are RELATIVE: 'lists' means /m14/01/lists.
 * TODO 1: ''         → redirect to 'overview' (pathMatch: 'full'!)
 *         'overview' → Overview,  'lists' → Lists,  'alerts' → Alerts   (each with a title: "Overview", "Lists", "Alerts")
 *         '**'       → NotFound (last: routes match in order)
 */
export const SECTION_ROUTES: Routes = [
];

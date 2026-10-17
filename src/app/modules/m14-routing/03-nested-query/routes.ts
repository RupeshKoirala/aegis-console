import { Routes } from '@angular/router';
import { AboutTab, IndicatorsTab, ListShell } from './list-shell';

/**
 * TODO 1: 'lists/:listId' → ListShell, with CHILDREN:
 *           ''           → redirect to 'indicators'
 *           'indicators' → IndicatorsTab
 *           'about'      → AboutTab
 *         and '' (top level) → redirect to 'lists/3'
 */
export const NESTED_ROUTES: Routes = [
  { path: '', redirectTo: 'lists/3', pathMatch: 'full' },
  {
    path: 'lists/:listId',
    component: ListShell,
    children: [
      { path: '', redirectTo: 'indicators', pathMatch: 'full' },
      { path: 'indicators', component: IndicatorsTab },
      { path: 'about', component: AboutTab },
    ],
  },
];

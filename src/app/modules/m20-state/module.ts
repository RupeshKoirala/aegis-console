import type { CourseModule } from '../../core/curriculum';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { alertsFeature } from './01-store/alerts.feature';
import { alertsEffects } from './02-effects/alerts.effects';

/**
 * provideStore() is in app.config.ts (the ROOT store; effects' runner lives there too).
 * The feature registers its slice and effects lazily, with its routes: the standard NgRx layout.
 */
const store = () => [provideState(alertsFeature)];

export const M20: CourseModule = {
  id: 'm20',
  title: 'State: NgRx & SignalStore',
  read: ['angular-manual/m12', 'foundations/l20', 'foundations/l12'],
  exercises: [
    { id: '01', title: 'Store: actions, reducer, selectors', load: () => import('./01-store/page').then(m => m.Page), providers: store() },
    { id: '02', title: 'Effects & optimistic triage', load: () => import('./02-effects/page').then(m => m.Page), providers: [...store(), provideEffects(alertsEffects)] },
    { id: '03', title: 'SignalStore', load: () => import('./03-signal-store/page').then(m => m.Page) },
  ],
};

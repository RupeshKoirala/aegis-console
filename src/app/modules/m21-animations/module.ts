import type { CourseModule } from '../../core/curriculum';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const M21: CourseModule = {
  id: 'm21',
  title: 'Animations',
  read: ['angular-manual/m3', 'foundations/l17'],
  exercises: [
    { id: '01', title: 'Native animate.enter / animate.leave', load: () => import('./01-native/page').then(m => m.Page) },
    {
      id: '02', title: 'Port a legacy animation', load: () => import('./02-legacy-port/page').then(m => m.Page),
      // Only the legacy panel needs this (deprecated, removal planned for v23).
      providers: [provideAnimationsAsync()],
    },
  ],
};

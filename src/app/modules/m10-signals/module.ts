import type { CourseModule } from '../../core/curriculum';

export const M10: CourseModule = {
  id: 'm10',
  title: 'Signals in depth',
  read: ['angular-manual/m6', 'angular-manual/m7', 'angular/l10'],
  exercises: [
    { id: '01', title: 'The reactive graph & equality', load: () => import('./01-graph-equality/page').then(m => m.Page) },
    { id: '02', title: 'linkedSignal', load: () => import('./02-linked-signal/page').then(m => m.Page) },
    { id: '03', title: 'untracked & effect cleanup', load: () => import('./03-untracked-cleanup/page').then(m => m.Page) },
    { id: '04', title: 'resource & httpResource', load: () => import('./04-resource/page').then(m => m.Page) },
  ],
};

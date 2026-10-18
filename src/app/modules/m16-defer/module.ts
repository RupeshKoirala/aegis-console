import type { CourseModule } from '../../core/curriculum';

export const M16: CourseModule = {
  id: 'm16',
  title: 'Lazy loading & @defer',
  read: ['angular-manual/m5', 'angular-manual/m16', 'foundations/l17'],
  exercises: [
    { id: '01', title: '@defer triggers', load: () => import('./01-triggers/page').then(m => m.Page) },
    { id: '02', title: '@defer when, in lists, on timer', load: () => import('./02-conditions-lists/page').then(m => m.Page) },
  ],
};

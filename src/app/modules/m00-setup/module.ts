import type { CourseModule } from '../../core/curriculum';

export const M00: CourseModule = {
  id: 'm00',
  title: 'Setup, TypeScript & the compiler',
  read: ['js/l15', 'js/l16', 'angular/l7', 'angular-manual/m1', 'angular-manual/m2'],
  exercises: [
    { id: '01', title: 'Typed domain helpers', load: () => import('./01-typed-domain/page').then(m => m.Page) },
    { id: '02', title: 'Your first components', load: () => import('./02-first-components/page').then(m => m.Page) },
    { id: '03', title: 'Your debugging bench', load: () => import('./03-debug-bench/page').then(m => m.Page) },
  ],
};

import type { CourseModule } from '../../core/curriculum';

export const M04: CourseModule = {
  id: 'm04',
  title: 'Debugging',
  read: ['foundations/l18', 'toolkit/l4', 'angular-manual/m17'],
  exercises: [
    { id: '01', title: 'Hunt the runtime bugs', load: () => import('./01-runtime-bugs/page').then(m => m.Page) },
    { id: '02', title: 'Debug the verdict engine', load: () => import('./02-logic-bugs/page').then(m => m.Page) },
  ],
};

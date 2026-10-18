import type { CourseModule } from '../../core/curriculum';

export const M22: CourseModule = {
  id: 'm22',
  title: 'Testing',
  read: ['angular-manual/m17', 'foundations/l14'],
  exercises: [
    { id: '01', title: 'Write the tests yourself', load: () => import('./01-write-tests/page').then(m => m.Page) },
    { id: '02', title: 'Component harnesses', load: () => import('./02-harnesses/page').then(m => m.Page) },
    { id: '03', title: 'End-to-end with Playwright', load: () => import('./03-e2e/page').then(m => m.Page) },
  ],
};

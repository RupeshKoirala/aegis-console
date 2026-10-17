import type { CourseModule } from '../../core/curriculum';

export const M07: CourseModule = {
  id: 'm07',
  title: 'Pipes',
  read: ['angular-manual/m10', 'angular/l9'],
  exercises: [
    { id: '01', title: 'The built-in catalog', load: () => import('./01-built-in/page').then(m => m.Page) },
    { id: '02', title: 'Custom pipes: defang, cidr, relative time', load: () => import('./02-custom/page').then(m => m.Page) },
    { id: '03', title: 'Pure vs impure', load: () => import('./03-pure-impure/page').then(m => m.Page) },
  ],
};

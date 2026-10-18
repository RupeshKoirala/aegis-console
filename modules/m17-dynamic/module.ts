import type { CourseModule } from '../../core/curriculum';

export const M17: CourseModule = {
  id: 'm17',
  title: 'Dynamic components',
  read: ['angular-manual/m3', 'angular-manual/m9'],
  exercises: [
    { id: '01', title: 'Toast host: createComponent', load: () => import('./01-toast-host/page').then(m => m.Page) },
    { id: '02', title: 'Configurable dashboard', load: () => import('./02-widget-registry/page').then(m => m.Page) },
  ],
};

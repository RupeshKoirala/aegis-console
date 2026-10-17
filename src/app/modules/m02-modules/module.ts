import type { CourseModule } from '../../core/curriculum';

export const M02: CourseModule = {
  id: 'm02',
  title: 'NgModules → standalone',
  read: ['angular-manual/m3', 'angular-manual/m11', 'angular-manual/m18'],
  exercises: [
    { id: '01', title: 'Build a feature with NgModules', load: () => import('./01-ngmodules/page').then(m => m.Page) },
    { id: '02', title: 'Migrate a module to standalone', load: () => import('./02-migrate-to-standalone/page').then(m => m.Page) },
  ],
};

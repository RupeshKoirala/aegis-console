import type { CourseModule } from '../../core/curriculum';

export const M25: CourseModule = {
  id: 'm25',
  title: 'CLI, schematics & Nx',
  read: ['angular-manual/m17', 'foundations/l29', 'foundations/l20'],
  exercises: [
    { id: '01', title: 'Architecture boundaries', load: () => import('./01-boundaries/page').then(m => m.Page) },
    { id: '02', title: 'CLI, schematics & Nx lab', load: () => import('./02-cli-lab/page').then(m => m.Page) },
  ],
};

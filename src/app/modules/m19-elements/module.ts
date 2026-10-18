import type { CourseModule } from '../../core/curriculum';

export const M19: CourseModule = {
  id: 'm19',
  title: 'Angular Elements',
  read: ['angular-manual/m3', 'foundations/l20'],
  exercises: [
    { id: '01', title: 'Embeddable verdict badge', load: () => import('./01-verdict-element/page').then(m => m.Page) },
  ],
};

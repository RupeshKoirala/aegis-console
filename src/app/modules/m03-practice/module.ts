import type { CourseModule } from '../../core/curriculum';

export const M03: CourseModule = {
  id: 'm03',
  title: 'Practice: capacity planner ×2',
  read: ['angular/l17', 'angular/l18', 'angular-manual/m9', 'angular-manual/m15'],
  exercises: [
    { id: '01', title: 'Planner, the v22 way', load: () => import('./01-planner-signals/page').then(m => m.Page) },
    { id: '02', title: 'Planner, the Gen 1 way', load: () => import('./02-planner-decorators/page').then(m => m.Page) },
  ],
};

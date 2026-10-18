import type { CourseModule } from '../../core/curriculum';
import { InvestigationStore } from './01-investigations/investigation.store';
import { INVESTIGATION_ROUTES } from './01-investigations/routes';

export const M27: CourseModule = {
  id: 'm27',
  title: 'Capstone',
  read: ['capstone/l1', 'angular-manual/m18'],
  exercises: [
    {
      id: '01', title: 'Investigation workspace', load: () => import('./01-investigations/page').then(m => m.Page),
      providers: [InvestigationStore], children: INVESTIGATION_ROUTES,
    },
  ],
};

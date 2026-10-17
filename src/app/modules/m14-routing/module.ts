import type { CourseModule } from '../../core/curriculum';
import { SECTION_ROUTES } from './01-routes-links/routes';
import { LIST_ROUTES } from './02-params-input/routes';
import { NESTED_ROUTES } from './03-nested-query/routes';
import { RESOLVED_ROUTES } from './04-resolvers-titles/routes';
import { GUARDED_ROUTES } from './05-guards/routes';
import { LAZY_ROUTES } from './06-lazy-preloading/routes';

export const M14: CourseModule = {
  id: 'm14',
  title: 'Routing',
  read: ['angular-manual/m13', 'angular/l15', 'foundations/l15'],
  exercises: [
    { id: '01', title: 'Routes, links & the outlet', load: () => import('./01-routes-links/page').then(m => m.Page), children: SECTION_ROUTES },
    { id: '02', title: 'Route params as inputs', load: () => import('./02-params-input/page').then(m => m.Page), children: LIST_ROUTES },
    { id: '03', title: 'Nested routes & query params', load: () => import('./03-nested-query/page').then(m => m.Page), children: NESTED_ROUTES },
    { id: '04', title: 'Resolvers & titles', load: () => import('./04-resolvers-titles/page').then(m => m.Page), children: RESOLVED_ROUTES },
    { id: '05', title: 'Guards', load: () => import('./05-guards/page').then(m => m.Page), children: GUARDED_ROUTES },
    { id: '06', title: 'Lazy loading & preloading', load: () => import('./06-lazy-preloading/page').then(m => m.Page), children: LAZY_ROUTES },
  ],
};

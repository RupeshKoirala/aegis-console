import type { CourseModule } from '../../core/curriculum';

export const M08: CourseModule = {
  id: 'm08',
  title: 'Dependency injection',
  read: ['angular-manual/m11', 'foundations/l12', 'spring/l2'],
  exercises: [
    { id: '01', title: 'The injector tree', load: () => import('./01-injector-tree/page').then(m => m.Page) },
    { id: '02', title: 'Providers & InjectionTokens', load: () => import('./02-providers-tokens/page').then(m => m.Page) },
    { id: '03', title: 'optional / self / skipSelf / host', load: () => import('./03-resolution-modifiers/page').then(m => m.Page) },
    { id: '04', title: 'Multi providers & injection context', load: () => import('./04-multi-and-context/page').then(m => m.Page) },
  ],
};

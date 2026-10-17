import type { CourseModule } from '../../core/curriculum';

export const M06: CourseModule = {
  id: 'm06',
  title: 'Directives',
  read: ['angular-manual/m10', 'angular-manual/m5'],
  exercises: [
    { id: '01', title: 'Attribute directive + Renderer2', load: () => import('./01-attribute/page').then(m => m.Page) },
    { id: '02', title: 'exportAs: template-visible state', load: () => import('./02-export-as/page').then(m => m.Page) },
    { id: '03', title: 'Structural directive *aegisHasRole', load: () => import('./03-structural/page').then(m => m.Page) },
    { id: '04', title: 'hostDirectives composition', load: () => import('./04-host-directives/page').then(m => m.Page) },
  ],
};

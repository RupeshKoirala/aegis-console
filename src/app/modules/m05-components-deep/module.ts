import type { CourseModule } from '../../core/curriculum';

export const M05: CourseModule = {
  id: 'm05',
  title: 'Components deep dive',
  read: ['angular-manual/m3', 'angular-manual/m9', 'angular-manual/m10', 'angular/l13'],
  exercises: [
    { id: '01', title: 'Host elements & attribute selectors', load: () => import('./01-host-and-selectors/page').then(m => m.Page) },
    { id: '02', title: 'Content projection & content queries', load: () => import('./02-projection/page').then(m => m.Page) },
    { id: '03', title: 'View encapsulation', load: () => import('./03-encapsulation/page').then(m => m.Page) },
    { id: '04', title: 'Lifecycle, DestroyRef, afterNextRender', load: () => import('./04-lifecycle/page').then(m => m.Page) },
    { id: '05', title: 'ng-template & ngTemplateOutlet', load: () => import('./05-templates/page').then(m => m.Page) },
    { id: '06', title: 'View queries & custom two-way binding', load: () => import('./06-queries-two-way/page').then(m => m.Page) },
  ],
};

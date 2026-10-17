import type { CourseModule } from '../../core/curriculum';

export const M09: CourseModule = {
  id: 'm09',
  title: 'Change detection',
  read: ['angular-manual/m8', 'foundations/l17', 'foundations/l7'],
  exercises: [
    { id: '01', title: 'OnPush: why the card is stale', load: () => import('./01-onpush-mechanics/page').then(m => m.Page) },
    { id: '02', title: 'Measure the render cost', load: () => import('./02-render-cost/page').then(m => m.Page) },
    { id: '03', title: 'ChangeDetectorRef: markForCheck, detach', load: () => import('./03-change-detector-ref/page').then(m => m.Page) },
    { id: '04', title: 'Zoneless audit', load: () => import('./04-zoneless/page').then(m => m.Page) },
  ],
};

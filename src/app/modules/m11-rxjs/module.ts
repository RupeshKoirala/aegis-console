import type { CourseModule } from '../../core/curriculum';

export const M11: CourseModule = {
  id: 'm11',
  title: 'RxJS & signal interop',
  read: ['js/l17', 'angular-manual/m12', 'foundations/l7'],
  exercises: [
    { id: '01', title: 'Observables from scratch', load: () => import('./01-observables/page').then(m => m.Page) },
    { id: '02', title: 'Search-as-you-type', load: () => import('./02-search/page').then(m => m.Page) },
    { id: '03', title: 'switch / concat / merge / exhaust', load: () => import('./03-higher-order/page').then(m => m.Page) },
    { id: '04', title: 'Live attack stream (SSE)', load: () => import('./04-live-stream/page').then(m => m.Page) },
    { id: '05', title: 'toSignal, toObservable, takeUntilDestroyed', load: () => import('./05-interop/page').then(m => m.Page) },
  ],
};

import type { CourseModule } from '../../core/curriculum';

export const M23: CourseModule = {
  id: 'm23',
  title: 'SSR, SSG & hydration',
  read: ['angular-manual/m16', 'foundations/l15', 'foundations/l30'],
  exercises: [
    { id: '01', title: 'SSR-safe code', load: () => import('./01-ssr-safe/page').then(m => m.Page) },
    { id: '02', title: 'Render modes per route', load: () => import('./02-render-modes/page').then(m => m.Page) },
  ],
};

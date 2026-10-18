import type { CourseModule } from '../../core/curriculum';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { trainingAuthInterceptor } from '../../core/training-auth.interceptor';
import { correlationIdInterceptor, tenantInterceptor, sessionInterceptor, TimingInterceptor } from './04-interceptors/interceptors';
import { cachingInterceptor, retryInterceptor } from './05-context-retry-cache/interceptors';
import { TRACE_CHAIN } from './07-trace/trace.interceptors';

export const M12: CourseModule = {
  id: 'm12',
  title: 'HTTP & interceptors',
  read: ['foundations/l16', 'js/l11', 'angular-manual/m14', 'capstone/l1'],
  exercises: [
    { id: '01', title: 'Typed GET with params', load: () => import('./01-get-typed/page').then(m => m.Page) },
    { id: '02', title: 'Loading, errors, problem+json', load: () => import('./02-loading-errors/page').then(m => m.Page) },
    { id: '03', title: 'POST, DELETE & optimistic updates', load: () => import('./03-mutations-optimistic/page').then(m => m.Page) },
    {
      id: '04', title: 'Interceptors', load: () => import('./04-interceptors/page').then(m => m.Page),
      providers: [
        provideHttpClient(withInterceptors([correlationIdInterceptor, tenantInterceptor, sessionInterceptor, trainingAuthInterceptor]), withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
      ],
    },
    {
      id: '05', title: 'HttpContext, retry & cache', load: () => import('./05-context-retry-cache/page').then(m => m.Page),
      providers: [provideHttpClient(withInterceptors([cachingInterceptor, retryInterceptor, trainingAuthInterceptor]))],
    },
    { id: '06', title: 'Testing HTTP code', load: () => import('./06-testing-http/page').then(m => m.Page) },
    {
      id: '07', title: 'Trace the onion', load: () => import('./07-trace/page').then(m => m.Page),
      providers: [provideHttpClient(withInterceptors(TRACE_CHAIN))],
    },
  ],
};

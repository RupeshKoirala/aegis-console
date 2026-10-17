import type { CourseModule } from '../../core/curriculum';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './02-refresh/auth.interceptor';
import { AUTH_ROUTES } from './03-guards-permissions/routes';
import { tenantInterceptor } from './04-tenant-idle/tenant-context';

/** From M15 on, these routes use YOUR interceptors instead of the training shortcut. */
const realAuth = (...extra: typeof authInterceptor[]) => [provideHttpClient(withInterceptors([...extra, authInterceptor]))];

export const M15: CourseModule = {
  id: 'm15',
  title: 'Auth',
  read: ['foundations/l26', 'foundations/l19', 'cyber/l12'],
  exercises: [
    { id: '01', title: 'Login & token storage', load: () => import('./01-login/page').then(m => m.Page), providers: [provideHttpClient()] },
    { id: '02', title: 'Auth interceptor & refresh', load: () => import('./02-refresh/page').then(m => m.Page), providers: realAuth() },
    { id: '03', title: 'Guards & permissions', load: () => import('./03-guards-permissions/page').then(m => m.Page), providers: realAuth(), children: AUTH_ROUTES },
    { id: '04', title: 'MSP tenant switch & idle timeout', load: () => import('./04-tenant-idle/page').then(m => m.Page), providers: realAuth(tenantInterceptor) },
  ],
};

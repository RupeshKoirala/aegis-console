import { HttpInterceptorFn, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, linkedSignal } from '@angular/core';
import { TenantView } from '../../../shared/domain/models';
import { Session } from '../shared/session';

/**
 * MSP admins (msp@shieldline.test) manage CHILD tenants. The API acts for a child when a request carries
 * X-Tenant-Id: <childId>; it answers 403 for any tenant that isn't your own or your child.
 */
@Injectable({ providedIn: 'root' })
export class TenantContext {
  private readonly session = inject(Session);

  /** Children of the signed-in tenant (empty for normal tenants). Done for you. */
  readonly children = httpResource<TenantView[]>(() => (this.session.isAuthenticated() ? '/api/v1/tenants/children' : undefined), { defaultValue: [] });

  /** The child tenant we're acting for, or null = our own. RESETS whenever the signed-in user changes. */
  readonly actingFor = linkedSignal<unknown, TenantView | null>({ source: this.session.user, computation: () => null });

  readonly label = computed(() => this.actingFor()?.name ?? this.session.user()?.tenantName ?? '');
}

/** TODO 2: add X-Tenant-Id: <actingFor id> to /api/ requests (not /api/v1/auth/*) while acting for a child. */
export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const acting = inject(TenantContext).actingFor();
  if (!acting || !req.url.startsWith('/api/') || req.url.includes('/auth/')) return next(req);
  return next(req.clone({ setHeaders: { 'X-Tenant-Id': String(acting.id) } }));
};

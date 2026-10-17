import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RequestLog, SessionEvents, TenantContext } from './session';

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('X-Correlation-Id')) return next(req);
  return next(req.clone({ setHeaders: { 'X-Correlation-Id': crypto.randomUUID() } }));
};

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenant = inject(TenantContext).actingFor();
  if (tenant === null || !req.url.startsWith('/api/')) return next(req);
  return next(req.clone({ setHeaders: { 'X-Tenant-Id': String(tenant) } }));
};

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionEvents);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) session.expired.set(true);
      return throwError(() => err);
    }),
  );
};

/** Gen 1 class-based interceptor, registered with HTTP_INTERCEPTORS + withInterceptorsFromDi(). */
@Injectable()
export class TimingInterceptor implements HttpInterceptor {
  private readonly log = inject(RequestLog);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = performance.now();
    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) this.log.add(`${req.method} ${req.urlWithParams} → ${event.status} in ${Math.round(performance.now() - started)} ms`);
        },
        error: (err: HttpErrorResponse) => this.log.add(`${req.method} ${req.urlWithParams} → ${err.status} in ${Math.round(performance.now() - started)} ms`),
      }),
    );
  }
}

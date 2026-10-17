import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, retry, tap, throwError, timer } from 'rxjs';

export const CACHE_TTL = new HttpContextToken<number>(() => 0);

const cache = new Map<string, { at: number; response: HttpResponse<unknown> }>();
export const clearHttpCache = () => cache.clear();

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  const ttl = req.context.get(CACHE_TTL);
  if (req.method !== 'GET' || ttl <= 0) return next(req);
  const hit = cache.get(req.urlWithParams);
  if (hit && Date.now() - hit.at < ttl) return of(hit.response.clone());
  return next(req).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) cache.set(req.urlWithParams, { at: Date.now(), response: event.clone() });
    }),
  );
};

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);
  return next(req).pipe(
    retry({
      count: 2,
      delay: (err: unknown, attempt) =>
        err instanceof HttpErrorResponse && (err.status === 0 || err.status >= 500) ? timer(300 * attempt) : throwError(() => err),
    }),
  );
};

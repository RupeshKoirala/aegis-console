import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
//@@sol
import { of, retry, tap, throwError, timer } from 'rxjs';
//@@end

export const CACHE_TTL = new HttpContextToken<number>(() => 0);

const cache = new Map<string, { at: number; response: HttpResponse<unknown> }>();
export const clearHttpCache = () => cache.clear();

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
//@@sol
  const ttl = req.context.get(CACHE_TTL);
  if (req.method !== 'GET' || ttl <= 0) return next(req);
  const hit = cache.get(req.urlWithParams);
  if (hit && Date.now() - hit.at < ttl) return of(hit.response.clone());
  return next(req).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) cache.set(req.urlWithParams, { at: Date.now(), response: event.clone() });
    }),
  );
//@@stub
  // TODO 1: only GET with req.context.get(CACHE_TTL) > 0 is cacheable.
  //         Fresh hit (younger than ttl) → return of(hit.response.clone()) without calling next.
  //         Miss → next(req).pipe(tap(...)) storing { at: Date.now(), response: event.clone() } for HttpResponse events.
  return next(req);
//@@end
};

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
//@@sol
  if (req.method !== 'GET') return next(req);
  return next(req).pipe(
    retry({
      count: 2,
      delay: (err: unknown, attempt) =>
        err instanceof HttpErrorResponse && (err.status === 0 || err.status >= 500) ? timer(300 * attempt) : throwError(() => err),
    }),
  );
//@@stub
  // TODO 2: GET only. retry({ count: 2, delay: (err, attempt) => … }):
  //         status 0 or ≥ 500 → timer(300 * attempt); anything else → throwError(() => err) (stop retrying)
  return next(req);
//@@end
};

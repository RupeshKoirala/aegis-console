import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';

export const CACHE_TTL = new HttpContextToken<number>(() => 0);

const cache = new Map<string, { at: number; response: HttpResponse<unknown> }>();
export const clearHttpCache = () => cache.clear();

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO 1: only GET with req.context.get(CACHE_TTL) > 0 is cacheable.
  //         Fresh hit (younger than ttl) → return of(hit.response.clone()) without calling next.
  //         Miss → next(req).pipe(tap(...)) storing { at: Date.now(), response: event.clone() } for HttpResponse events.
  return next(req);
};

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO 2: GET only. retry({ count: 2, delay: (err, attempt) => … }):
  //         status 0 or ≥ 500 → timer(300 * attempt); anything else → throwError(() => err) (stop retrying)
  return next(req);
};

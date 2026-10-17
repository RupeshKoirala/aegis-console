import { HttpInterceptorFn } from '@angular/common/http';

/**
 * TRAINING SHORTCUT. Until you build real sign-in in M15, every /api request without an Authorization
 * header is sent as the seeded admin of Acme Schools. The fake API accepts "Bearer dev:<email>" for this.
 * Never ship anything like this: it's the moral equivalent of a hard-coded password.
 */
export const trainingAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/') || req.headers.has('Authorization')) return next(req);
  return next(req.clone({ setHeaders: { Authorization: 'Bearer dev:admin@acme.test' } }));
};

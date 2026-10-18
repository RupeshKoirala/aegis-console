import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, InjectionToken, inject } from '@angular/core';

/** What gets sent to the monitoring backend (Sentry, Datadog RUM, or the platform series' log pipeline). */
export interface ClientErrorReport {
  message: string;
  kind: 'http' | 'runtime';
  status?: number;
  /** links the browser error to the backend logs: the X-Correlation-Id header from M12.04 */
  correlationId?: string;
  url: string;
  release: string;
  at: string;
}

export const REPORT_SINK = new InjectionToken<(r: ClientErrorReport) => void>('REPORT_SINK', {
  factory: () => r => console.warn('[would send to monitoring]', r),
});
export const RELEASE = new InjectionToken<string>('RELEASE', { factory: () => 'dev' });
export const CLOCK = new InjectionToken<() => number>('CLOCK', { factory: () => () => Date.now() });

/**
 * TODO 1: scrub secrets and personal data BEFORE anything leaves the browser (monitoring vendors are third parties):
 *   "Bearer <anything>"       → "Bearer [redacted]"
 *   JWT-looking strings       (three base64url parts separated by dots, each 10+ chars) → "[jwt]"
 *   e-mail addresses          → "[email]"
 *   access_token=… / refreshToken=… in query strings → the value replaced with [redacted]
 */
export function scrub(text: string): string {
  return text;
}

/**
 * TODO 2: the global ErrorHandler:
 *   - build a report: HttpErrorResponse → kind 'http', status, message `${status} ${url}`, and correlationId from
 *     error.headers.get('X-Correlation-Id') (if any); anything else → kind 'runtime', message = error.message or String(error)
 *   - url: location.pathname (no query string: it may hold tokens), release from RELEASE, at = new Date(clock()).toISOString()
 *   - scrub() the message
 *   - DEDUPE: the same message within 60 s is sent only once (a failing poll would otherwise send 1,000 reports)
 *   - always console.error(error) for developers
 */
@Injectable()
export class ErrorReporter implements ErrorHandler {
  private readonly sink = inject(REPORT_SINK);
  private readonly release = inject(RELEASE);
  private readonly clock = inject(CLOCK);

  handleError(error: unknown): void {
    console.error(error);
  }
}

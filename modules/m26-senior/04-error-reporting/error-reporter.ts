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
//@@sol
  return text
    .replace(/Bearer\s+[^\s"']+/g, 'Bearer [redacted]')
    .replace(/\b[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, '[jwt]')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
    .replace(/((?:access_token|refreshToken|refresh_token)=)[^&\s]+/gi, '$1[redacted]');
//@@stub
  return text;
//@@end
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
//@@sol
  private readonly lastSent = new Map<string, number>();
//@@end

  handleError(error: unknown): void {
    console.error(error);
//@@sol
    const report: ClientErrorReport =
      error instanceof HttpErrorResponse
        ? {
            kind: 'http', status: error.status, message: scrub(`${error.status} ${error.url ?? ''}`.trim()),
            correlationId: error.headers?.get('X-Correlation-Id') ?? undefined,
            url: location.pathname, release: this.release, at: new Date(this.clock()).toISOString(),
          }
        : {
            kind: 'runtime', message: scrub(error instanceof Error ? error.message : String(error)),
            url: location.pathname, release: this.release, at: new Date(this.clock()).toISOString(),
          };
    const now = this.clock();
    const last = this.lastSent.get(report.message);
    if (last !== undefined && now - last < 60_000) return;
    this.lastSent.set(report.message, now);
    this.sink(report);
//@@stub
//@@end
  }
}

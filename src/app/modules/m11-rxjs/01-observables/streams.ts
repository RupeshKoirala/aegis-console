import { Observable } from 'rxjs';

export function heartbeat(ms: number): Observable<number> {
  // TODO 1: emit 1, 2, 3… every `ms` milliseconds; the teardown must clear the interval
  return new Observable<number>();
}

const LINE = /^((\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?|([a-z0-9-]+\.)+[a-z]{2,})$/i;

/** Emits each indicator in a feed file. Skips blank lines and # comments. Errors on the first invalid line. */
export function parseFeed(text: string): Observable<string> {
  // TODO 2: synchronously emit every valid line (trimmed, lower-cased), skipping blanks and lines starting with #.
  //         On the first line that fails LINE.test → subscriber.error(new Error(`line ${n}: "${line}" is not an indicator`))
  //         (n is 1-based) and stop. Otherwise complete() at the end.
  return new Observable<string>(subscriber => subscriber.complete());
}

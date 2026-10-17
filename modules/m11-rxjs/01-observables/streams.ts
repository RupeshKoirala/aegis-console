import { Observable } from 'rxjs';

export function heartbeat(ms: number): Observable<number> {
//@@sol
  return new Observable<number>(subscriber => {
    let n = 0;
    const id = setInterval(() => subscriber.next(++n), ms);
    return () => clearInterval(id);
  });
//@@stub
  // TODO 1: emit 1, 2, 3… every `ms` milliseconds; the teardown must clear the interval
  return new Observable<number>();
//@@end
}

const LINE = /^((\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?|([a-z0-9-]+\.)+[a-z]{2,})$/i;

/** Emits each indicator in a feed file. Skips blank lines and # comments. Errors on the first invalid line. */
export function parseFeed(text: string): Observable<string> {
//@@sol
  return new Observable<string>(subscriber => {
    for (const [index, raw] of text.split('\n').entries()) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      if (!LINE.test(line)) {
        subscriber.error(new Error(`line ${index + 1}: "${line}" is not an indicator`));
        return;
      }
      subscriber.next(line.toLowerCase());
    }
    subscriber.complete();
  });
//@@stub
  // TODO 2: synchronously emit every valid line (trimmed, lower-cased), skipping blanks and lines starting with #.
  //         On the first line that fails LINE.test → subscriber.error(new Error(`line ${n}: "${line}" is not an indicator`))
  //         (n is 1-based) and stop. Otherwise complete() at the end.
  return new Observable<string>(subscriber => subscriber.complete());
//@@end
}

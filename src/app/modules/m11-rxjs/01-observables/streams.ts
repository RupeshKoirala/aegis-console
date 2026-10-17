import { Observable } from 'rxjs';

export function heartbeat(ms: number): Observable<number> {
  return new Observable<number>(subscriber => {
    let n = 0;
    const id = setInterval(() => subscriber.next(++n), ms);
    return () => clearInterval(id);
  });
}

const LINE = /^((\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?|([a-z0-9-]+\.)+[a-z]{2,})$/i;

/** Emits each indicator in a feed file. Skips blank lines and # comments. Errors on the first invalid line. */
export function parseFeed(text: string): Observable<string> {
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
}

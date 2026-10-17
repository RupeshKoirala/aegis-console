import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, bufferTime, filter, map, scan, share } from 'rxjs';
import { TrafficEvent } from '../../../shared/domain/models';

/** How to open an SSE connection. Real EventSource by default; tests replace it with a fake. */
export const EVENT_SOURCE = new InjectionToken<(url: string) => EventSource>('event-source', {
  providedIn: 'root',
  factory: () => (url: string) => new EventSource(url),
});

export const STREAM_URL = '/api/v1/events/stream?every=400&access_token=dev:admin@acme.test';

@Injectable({ providedIn: 'root' })
export class LiveEvents {
  private readonly open = inject(EVENT_SOURCE);

  readonly events$ = new Observable<TrafficEvent>(subscriber => {
    const source = this.open(STREAM_URL);
    source.addEventListener('traffic', e => subscriber.next(JSON.parse((e as MessageEvent).data)));
    source.onerror = () => subscriber.error(new Error('stream lost'));
    return () => source.close();
  }).pipe(share());

  readonly recent$ = this.events$.pipe(scan((acc, e) => [e, ...acc].slice(0, 20), [] as TrafficEvent[]));
  readonly perSecond$ = this.events$.pipe(bufferTime(1000), map(batch => batch.length));
  readonly blocked$ = this.events$.pipe(filter(e => e.action === 'BLOCK'), scan(n => n + 1, 0));
}

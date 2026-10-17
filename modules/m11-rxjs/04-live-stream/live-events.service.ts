import { Injectable, InjectionToken, inject } from '@angular/core';
//@@sol
import { Observable, bufferTime, filter, map, scan, share } from 'rxjs';
//@@stub
import { Observable, of } from 'rxjs';
//@@end
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

//@@sol
  readonly events$ = new Observable<TrafficEvent>(subscriber => {
    const source = this.open(STREAM_URL);
    source.addEventListener('traffic', e => subscriber.next(JSON.parse((e as MessageEvent).data)));
    source.onerror = () => subscriber.error(new Error('stream lost'));
    return () => source.close();
  }).pipe(share());

  readonly recent$ = this.events$.pipe(scan((acc, e) => [e, ...acc].slice(0, 20), [] as TrafficEvent[]));
  readonly perSecond$ = this.events$.pipe(bufferTime(1000), map(batch => batch.length));
  readonly blocked$ = this.events$.pipe(filter(e => e.action === 'BLOCK'), scan(n => n + 1, 0));
//@@stub
  // TODO 1: events$: a new Observable that opens this.open(STREAM_URL), emits JSON.parse(e.data) for every
  //         'traffic' event, errors on onerror, and CLOSES the source in its teardown. Then .pipe(share()).
  readonly events$: Observable<TrafficEvent> = of();
  // TODO 2: recent$: newest first, at most 20, using scan
  readonly recent$: Observable<TrafficEvent[]> = of([]);
  // TODO 3: perSecond$: number of events per 1000 ms window (bufferTime + map)
  readonly perSecond$: Observable<number> = of(0);
  // TODO 4: blocked$: running count of BLOCK events (filter + scan)
  readonly blocked$: Observable<number> = of(0);
//@@end
}

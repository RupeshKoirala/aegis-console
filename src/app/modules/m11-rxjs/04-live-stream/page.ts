import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { LiveEvents } from './live-events.service';

@Component({
  selector: 'app-m11-04',
  imports: [DatePipe],
  template: `
    <h1>Live traffic</h1>
    <p class="row"><strong class="rate">{{ perSecond() }}/s</strong> <span class="blocked">blocked so far: {{ blocked() }}</span></p>
    <table class="card">
      @for (e of recent(); track e.id) {
        <tr class="event"><td class="mono">{{ e.at | date: 'HH:mm:ss' : 'UTC' }}</td><td><span class="pill" [class]="e.action">{{ e.action }}</span></td>
          <td class="mono">{{ e.source }} → {{ e.destination }}</td><td class="sev" [class]="e.severity">{{ e.severity }}</td></tr>
      } @empty { <tr><td class="muted">waiting for events… (is <code>npm start</code> running?)</td></tr> }
    </table>
  `,
  styles: `table.card { padding: 0; }`,
})
export class Page {
  private readonly live = inject(LiveEvents);
  readonly recent = toSignal(this.live.recent$, { initialValue: [] });
  readonly perSecond = toSignal(this.live.perSecond$, { initialValue: 0 });
  readonly blocked = toSignal(this.live.blocked$, { initialValue: 0 });
}

import { Component, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { withConcat, withExhaust, withMerge, withSwitch } from './operators';

@Component({
  selector: 'app-m11-03',
  template: `
    <h1>Operator race lab</h1>
    <p class="muted">Click a button fast, three times, then watch who finishes.</p>
    <div class="grid">
      @for (lane of lanes; track lane.name) {
        <section class="card"><h3>{{ lane.name }}</h3>
          <button (click)="lane.click()">Click</button>
          <ol>@for (o of lane.out(); track $index) { <li class="mono">{{ o }}</li> }</ol></section>
      }
    </div>
  `,
})
export class Page {
  private id = 0;
  protected readonly lanes = [
    { name: 'switchMap', op: withSwitch },
    { name: 'concatMap', op: withConcat },
    { name: 'mergeMap', op: withMerge },
    { name: 'exhaustMap', op: withExhaust },
  ].map(l => {
    const clicks = new Subject<number>();
    const out = signal<string[]>([]);
    l.op(clicks).subscribe(v => out.update(o => [...o, v]));
    return { name: l.name, out, click: () => clicks.next(++this.id) };
  });
}

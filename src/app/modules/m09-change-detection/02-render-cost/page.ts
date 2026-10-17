import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PointRow } from './point-row';

@Component({
  selector: 'app-m09-02',
  imports: [PointRow],
  template: `
    <h1>Render cost</h1>
    <p class="row"><strong class="rate">{{ eventsPerSecond() }} events/s</strong>
      <button class="start" (click)="start()">Start ticker</button> <button (click)="stop()">Stop</button></p>
    <section class="card rows">
      @for (p of points; track p) { <aegis-point-row [name]="p" /> }
    </section>
  `,
  styles: `.rows { max-height: 480px; overflow: auto; padding: 0; }`,
})
export class Page {
  readonly points = Array.from({ length: 200 }, (_, i) => `edge-fw-${String(i + 1).padStart(3, '0')}`);
  readonly eventsPerSecond = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  tick() {
    this.eventsPerSecond.set(Math.round(800 + Math.random() * 400));
  }

  start() {
    this.stop();
    this.timer = setInterval(() => this.tick(), 100);
  }

  stop() {
    clearInterval(this.timer);
  }
}

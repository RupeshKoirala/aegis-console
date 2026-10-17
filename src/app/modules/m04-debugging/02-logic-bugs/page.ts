import { Component, computed, signal } from '@angular/core';
import { INDICATORS, LISTS } from '../../../shared/domain/sample-data';
import { decide } from './verdict-engine';

@Component({
  selector: 'app-m04-02',
  template: `
    <h1>Verdict check</h1>
    <p class="muted">Try 192.0.2.10 · 198.51.100.20 · 203.0.113.66 · 192.0.2.200 · www.evil.example · notevil.example</p>
    <input class="q mono" [value]="query()" (input)="query.set($any($event.target).value)" placeholder="IP or domain" />
    @let v = result();
    <section class="card result" [attr.data-verdict]="v.verdict">
      <h2><span class="pill" [class]="v.verdict">{{ v.verdict }}</span> {{ v.reason }}</h2>
      @for (m of v.matches; track m.listId + m.value) {
        <p class="mono">{{ m.kind }} · {{ m.listName }} · {{ m.value }} @if (m.score) { · score {{ m.score }} }</p>
      } @empty {
        <p class="muted">No list matched</p>
      }
    </section>
  `,
  styles: `.q { width: 360px; margin: 10px 0 16px; } .result h2 { display: flex; gap: 10px; align-items: center; font-size: 18px; margin-top: 0; }`,
})
export class Page {
  readonly query = signal('198.51.100.20');
  readonly result = computed(() => decide(this.query(), INDICATORS, LISTS, 90));
}

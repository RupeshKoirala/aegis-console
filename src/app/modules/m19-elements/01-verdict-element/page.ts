import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EnvironmentInjector, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { defineVerdictElement } from './define';

@Component({
  selector: 'app-m19-01',
  // Angular templates reject unknown tags; this schema says "trust me, it's a custom element".
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h1>Embeddable verdict <small class="muted">Angular Elements</small></h1>
    <section class="card">
      <h3>1 · Used from an Angular template (attributes in, DOM events out)</h3>
      <aegis-verdict value="203.0.113.66" verdict="BLOCK" (details)="log($event)" />
      <aegis-verdict value="partner.example" verdict="ALLOW" (details)="log($event)" />
    </section>
    <section class="card">
      <h3>2 · Used from plain HTML that Angular doesn't control</h3>
      <div #foreign class="foreign"></div>
    </section>
    <pre class="card log">{{ events().join('\\n') || 'Click "why?" on a badge.' }}</pre>
  `,
})
export class Page {
  private readonly foreign = viewChild.required<ElementRef<HTMLElement>>('foreign');
  readonly events = signal<string[]>([]);

  constructor() {
    // The ROOT environment injector: it outlives this page. (This component's own injector dies when you navigate away,
    // and every <aegis-verdict> defined with it would break.)
    defineVerdictElement(inject(EnvironmentInjector));
    afterNextRender(() => {
      // This is what a partner's website would do: write HTML, listen with addEventListener.
      const host = this.foreign().nativeElement;
      host.innerHTML = '<aegis-verdict value="crypto-miner.example" verdict="BLOCK"></aegis-verdict> <aegis-verdict value="10.0.0.1"></aegis-verdict>';
      host.addEventListener('details', e => this.log(e));
    });
  }

  log(e: Event) {
    const d = (e as CustomEvent<{ value: string; verdict: string }>).detail;
    this.events.update(l => [`details → ${d.verdict} ${d.value}`, ...l].slice(0, 6));
  }
}

import { Component, ErrorHandler, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { NGSW_CONFIG } from './ngsw-config';

@Component({
  selector: 'app-m24-02',
  imports: [JsonPipe],
  template: `
    <h1>Offline caching & stale chunks</h1>
    <div class="card"><button (click)="simulate()">Simulate a post-deploy chunk error</button>
      <span class="muted">With your ChunkErrorHandler registered (route providers for this page), this reloads once.</span></div>
    <pre class="card">{{ config | json }}</pre>
  `,
})
export class Page {
  protected readonly config = NGSW_CONFIG;
  private readonly handler = inject(ErrorHandler);
  simulate() {
    this.handler.handleError(new TypeError('Failed to fetch dynamically imported module: http://localhost:4200/chunk-OLD123.js'));
  }
}

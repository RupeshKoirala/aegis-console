import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, inject } from '@angular/core';

@Component({
  selector: 'app-m26-04',
  template: `
    <h1>Production error reporting</h1>
    <p class="muted">This route's ErrorHandler is your ErrorReporter, and reports go to the console as "[would send to monitoring]". Open DevTools.</p>
    <div class="row card">
      <button (click)="crash()">Throw with a token in the message</button>
      <button (click)="crash()">…again (deduped)</button>
      <button (click)="http404()">Unhandled HTTP 404</button>
    </div>
  `,
})
export class Page {
  private readonly http = inject(HttpClient);
  private readonly handler = inject(ErrorHandler);
  crash() {
    this.handler.handleError(new Error('Refresh failed for ana@acme.test with Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIn0.c2lnbmF0dXJlLXZhbHVl'));
  }
  http404() {
    this.http.get('/api/v1/lists/999').subscribe({ error: e => this.handler.handleError(e) });
  }
}

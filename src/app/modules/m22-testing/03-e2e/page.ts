import { Component } from '@angular/core';

@Component({
  selector: 'app-m22-03',
  template: `
    <h1>End-to-end tests <small class="muted">Playwright</small></h1>
    <div class="card">
      <p>This exercise has no page. Its file is <code>src/app/modules/m22-testing/03-e2e/console.e2e.ts</code>.</p>
      <ol>
        <li>Once: <code>npx playwright install chromium</code></li>
        <li>Run: <code>npm run e2e</code> (starts the API and the app for you), or <code>npm run e2e -- --ui</code> for the time-travel UI.</li>
        <li>Debug a failure: <code>npx playwright show-report</code> (screenshots, traces, the DOM at every step).</li>
      </ol>
    </div>
  `,
})
export class Page {}

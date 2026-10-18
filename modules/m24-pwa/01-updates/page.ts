import { Component, inject } from '@angular/core';
import { AppUpdates } from './app-updates';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-m24-01',
  template: `
    <h1>App updates <small class="muted">SwUpdate</small></h1>
    @if (updates.ready(); as v) {
      <div class="card update-banner" role="status">A new version of Aegis is ready ({{ v.latest.slice(0, 7) }}).
        <button class="primary" (click)="updates.applyUpdate()">Reload now</button></div>
    }
    @if (updates.broken()) { <div class="card error-text">The app can't recover offline. <button (click)="reload()">Reload</button></div> }
    <div class="card">
      <p>Service worker enabled here: <b>{{ enabled ? 'yes' : 'no' }}</b></p>
      <p class="muted">The dev server never runs a service worker. See the README lab: build for production, serve <code>dist/</code>, deploy a change, and watch this banner appear in the already-open tab.</p>
    </div>
  `,
})
export class Page {
  protected readonly updates = inject(AppUpdates);
  protected readonly enabled = inject(SwUpdate).isEnabled;
  reload() {
    location.reload();
  }
}

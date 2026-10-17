import { Component, signal } from '@angular/core';
import { HasUnsavedChanges } from './guards';

@Component({ selector: 'app-g-lists', template: `<h2 class="lists">Lists</h2><p class="muted">Everyone may see this.</p>` })
export class GLists {}

@Component({ selector: 'app-g-users', template: `<h2 class="users">User admin</h2><p class="muted">ADMIN only.</p>` })
export class GUsers {}

@Component({ selector: 'app-g-forbidden', template: `<h2 class="forbidden">403 · your role can't open that</h2>` })
export class GForbidden {}

@Component({ selector: 'app-g-map', template: `<h2 class="map">Threat map (beta)</h2><p>🌍 live attack origins…</p>` })
export class GThreatMap {}

@Component({ selector: 'app-g-soon', template: `<h2 class="soon">Threat map: coming soon</h2><p class="muted">Enable the beta flag to see it.</p>` })
export class GComingSoon {}

@Component({
  selector: 'app-g-new-list',
  template: `
    <h2>New list</h2>
    <input class="name" placeholder="name" [value]="name()" (input)="name.set($any($event.target).value)" />
    <button class="primary" (click)="saved.set(name())">Save</button>
    @if (hasUnsavedChanges()) { <small class="muted">unsaved</small> }
  `,
})
export class GNewList implements HasUnsavedChanges {
  readonly name = signal('');
  readonly saved = signal('');
  hasUnsavedChanges() {
    return this.name() !== this.saved();
  }
}

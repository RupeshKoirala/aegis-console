import { Component } from '@angular/core';
import { CURRICULUM } from './curriculum';

@Component({
  selector: 'app-home',
  template: `
    <h1>Aegis Console: training ground</h1>
    <p class="lead">
      You are building the analyst console of <strong>Aegis</strong>, a threat-intelligence enforcement platform:
      tenants, allow/block/threat lists, indicators, verdicts, alerts. Every exercise adds a real piece of it.
    </p>
    <ol class="steps">
      <li><strong>Read</strong> the Study Hub lessons listed in the module README.</li>
      <li><strong>Open</strong> <code>src/app/modules/mNN-…/NN-…/README.md</code>.</li>
      <li><strong>Run</strong> <code>npm run ex -- m01/02</code>. The tests watch your files and turn green when you're done.</li>
      <li><strong>Write</strong> the code at every <code>TODO</code>. The HTML, CSS and data are already there.</li>
      <li><strong>See it</strong> live in the sidebar, then commit.</li>
    </ol>
    <h3>Modules available: {{ count }}</h3>
    <p class="muted">Sign-in for later modules: <code>admin&#64;acme.test</code> / <code>password123</code> (fake API on port 3000).</p>
  `,
  styles: `.lead { color: var(--muted); max-width: 70ch; line-height: 1.6; } .steps li { margin: 8px 0; line-height: 1.6; }`,
})
export class Home {
  protected readonly count = CURRICULUM.length;
}

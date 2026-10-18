import { Component, viewChild, afterNextRender } from '@angular/core';
import { ReportHeader } from './report-header';

@Component({
  selector: 'app-m23-01',
  imports: [ReportHeader],
  template: `
    <aegis-report-header headline="Botnet C2 wave targets school networks" published="15 Oct 2026"
      summary="203.0.113.66 and 4 related hosts are command-and-control servers for a botnet hitting K-12 networks." />
    <article class="card">
      <p>Between 09:00 and 12:00 UTC, Aegis enforcement points blocked 1,204 connections from 37 tenants to five hosts…</p>
    </article>
  `,
})
export class Page {
  private readonly header = viewChild.required(ReportHeader);
  constructor() {
    afterNextRender(() => this.header().setSeo());
  }
}

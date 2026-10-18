import { Component, ElementRef, PLATFORM_ID, afterNextRender, inject, input, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export const DENSITY_KEY = 'aegis.density';

/**
 * The header of a PUBLIC threat report page (/reports/:id). Public pages are rendered on the SERVER (SSR/SSG) so
 * search engines and link previews see real content. On the server there is no window, document.body layout,
 * localStorage or matchMedia: touching them crashes the render or produces wrong HTML.
 */
@Component({
  selector: 'aegis-report-header',
  template: `
    <header class="report-header" [class.compact]="density() === 'compact'">
      <h1 class="headline">{{ headline() }}</h1>
      <p class="muted">Aegis threat report · {{ published() }}</p>
      @if (width() !== null) { <small class="muted width">rendered at {{ width() }}px</small> }
    </header>
  `,
})
export class ReportHeader {
  readonly headline = input.required<string>();
  readonly summary = input.required<string>();
  readonly published = input.required<string>();
  readonly density = signal<'comfortable' | 'compact'>('comfortable');
  readonly width = signal<number | null>(null);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // Browser-only APIs: guarded by platform, or deferred to afterNextRender (which never runs on the server).
    if (this.isBrowser) {
      const saved = localStorage.getItem(DENSITY_KEY);
      if (saved === 'compact' || saved === 'comfortable') this.density.set(saved);
    }
    afterNextRender(() => this.width.set(Math.round(this.host.nativeElement.getBoundingClientRect().width)));
  }

  /**
   * TODO 3: SEO and link previews are WHY these pages are server-rendered. Call this from the page once inputs are known:
   *   title "<headline> · Aegis threat report"; meta description = summary; og:title = headline (property: 'og:title').
   *   Title and Meta work on the server too (they write into the rendered <head>), with no `document` needed.
   */
  setSeo(): void {
    this.title.setTitle(`${this.headline()} · Aegis threat report`);
    this.meta.updateTag({ name: 'description', content: this.summary() });
    this.meta.updateTag({ property: 'og:title', content: this.headline() });
  }
}

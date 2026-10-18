import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { DENSITY_KEY, ReportHeader } from './report-header';

function render(platform: 'browser' | 'server') {
  TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: platform }] });
  const f = TestBed.createComponent(ReportHeader);
  f.componentRef.setInput('headline', 'Botnet C2 wave');
  f.componentRef.setInput('summary', 'Five C2 hosts');
  f.componentRef.setInput('published', '15 Oct 2026');
  return f;
}

describe('M23.01 · SSR-safe code', () => {
  afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

  it('TODO 1: on the server, localStorage is never touched', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem');
    const f = render('server');
    f.detectChanges();
    expect(spy).not.toHaveBeenCalled();
    expect(f.componentInstance.density()).toBe('comfortable');
  });

  it('TODO 1: in the browser, the saved density is used', () => {
    localStorage.setItem(DENSITY_KEY, 'compact');
    const f = render('browser');
    f.detectChanges();
    expect(f.nativeElement.querySelector('.report-header').classList).toContain('compact');
  });

  it('TODO 2: layout is measured after render, not during construction', async () => {
    const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    const f = render('browser');
    expect(spy).not.toHaveBeenCalled();
    f.autoDetectChanges();
    await f.whenStable();
    expect(spy).toHaveBeenCalled();
    expect(f.componentInstance.width()).not.toBeNull();
  });

  it('TODO 3: title and meta tags for SEO / link previews', () => {
    const f = render('server');
    f.detectChanges();
    f.componentInstance.setSeo();
    expect(TestBed.inject(Title).getTitle()).toBe('Botnet C2 wave · Aegis threat report');
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe('Five C2 hosts');
    expect(TestBed.inject(Meta).getTag('property="og:title"')?.content).toBe('Botnet C2 wave');
  });
});

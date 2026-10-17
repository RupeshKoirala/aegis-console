import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Page } from './page';

const verdict = { query: '203.0.113.66', type: 'IP', verdict: 'BLOCK', reason: 'THREAT_SCORE', threshold: 90, matches: [{}], engine: 'fake' };

describe('M10.04 · httpResource', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  it('TODO 1 + 3: loads the verdict for the query and renders it', async () => {
    const f = TestBed.createComponent(Page);
    f.detectChanges();
    TestBed.tick();
    const req = http.expectOne(r => r.url === '/api/v1/verdict');
    expect(req.request.params.get('q')).toBe('203.0.113.66');
    f.detectChanges();
    expect(f.nativeElement.querySelector('.loading')).not.toBeNull();
    req.flush(verdict);
    await f.whenStable();
    expect(f.nativeElement.querySelector('.result h2')?.textContent).toContain('BLOCK');
    expect(f.nativeElement.querySelector('.reason')?.textContent).toBe('THREAT_SCORE');
  });

  it('TODO 1: no request for an empty query', async () => {
    const f = TestBed.createComponent(Page);
    f.componentInstance.query.set('   ');
    f.detectChanges();
    TestBed.tick();
    http.expectNone(() => true);
    await f.whenStable();
    expect(f.nativeElement.querySelector('.idle')).not.toBeNull();
  });

  it('TODO 2: slow mode adds _delay', () => {
    const f = TestBed.createComponent(Page);
    f.componentInstance.slow.set(true);
    f.detectChanges();
    TestBed.tick();
    expect(http.expectOne(r => r.url === '/api/v1/verdict').request.params.get('_delay')).toBe('1500');
  });

  it('TODO 3: error state with a working retry', async () => {
    const f = TestBed.createComponent(Page);
    f.detectChanges();
    TestBed.tick();
    http.expectOne(r => r.url === '/api/v1/verdict').flush({ title: 'boom' }, { status: 503, statusText: 'Unavailable' });
    await f.whenStable();
    const retry = f.nativeElement.querySelector('.retry') as HTMLElement;
    expect(retry).not.toBeNull();
    retry.click();
    TestBed.tick();
    http.expectOne(r => r.url === '/api/v1/verdict').flush(verdict);
    await f.whenStable();
    expect(f.nativeElement.querySelector('.reason')?.textContent).toBe('THREAT_SCORE');
  });
});

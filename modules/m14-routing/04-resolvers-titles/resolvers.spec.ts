import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { Page } from './page';
import { RESOLVED_ROUTES } from './routes';
import { LISTS } from '../../../shared/domain/sample-data';

async function setup() {
  TestBed.configureTestingModule({
    providers: [provideRouter([{ path: 'x', component: Page, children: RESOLVED_ROUTES }], withComponentInputBinding()), provideHttpClient(), provideHttpClientTesting()],
  });
  const harness = await RouterTestingHarness.create();
  return { harness, http: TestBed.inject(HttpTestingController), router: TestBed.inject(Router), el: () => harness.routeNativeElement as HTMLElement };
}

describe('M14.04 · resolvers & titles', () => {
  it('TODO 1+4: the page renders only once the list has arrived', async () => {
    const { harness, http, el } = await setup();
    const nav = harness.navigateByUrl('/x/lists/3');
    await new Promise(r => setTimeout(r));
    expect(el()?.querySelector('.name')).toBeFalsy();
    http.match('/api/v1/lists/3').forEach(r => r.flush(LISTS[2]));
    await nav;
    expect(el().querySelector('.name')?.textContent).toContain('Webroot sample');
    http.verify();
  });

  it('TODO 2+3: title from the same, single request', async () => {
    const { harness, http } = await setup();
    const nav = harness.navigateByUrl('/x/lists/2');
    await new Promise(r => setTimeout(r));
    http.expectOne('/api/v1/lists/2').flush(LISTS[1]);
    await nav;
    expect(TestBed.inject(Title).getTitle()).toBe('Manual blocks · Lists');
    http.verify();
  });

  it('TODO 1: a 404 redirects to not-found; errors are not cached', async () => {
    const { harness, http, router, el } = await setup();
    const nav = harness.navigateByUrl('/x/lists/99');
    await new Promise(r => setTimeout(r));
    http.match('/api/v1/lists/99').forEach(r => r.flush({ title: 'Not Found', status: 404, detail: 'List 99 not found', instance: '/api/v1/lists/99' }, { status: 404, statusText: 'Not Found' }));
    await nav;
    await harness.fixture.whenStable();
    expect(router.url).toBe('/x/not-found');
    expect(el().querySelector('.nf')).toBeTruthy();
    const again = harness.navigateByUrl('/x/lists/99');
    await new Promise(r => setTimeout(r));
    expect(http.match('/api/v1/lists/99').length).toBeGreaterThan(0);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Page } from './page';
import { NESTED_ROUTES } from './routes';
import { IndicatorsTab } from './list-shell';

async function setup(url: string) {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'x', component: Page, children: NESTED_ROUTES }], withComponentInputBinding())] });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  const el = harness.routeNativeElement as HTMLElement;
  const rows = () => [...el.querySelectorAll('li .mono')].map(e => e.textContent);
  return { harness, el, rows, router: TestBed.inject(Router) };
}

describe('M14.03 · nested routes & query params', () => {
  it('TODO 1: nested redirects land on the indicators tab', async () => {
    const { router, el, harness } = await setup('/x');
    expect(router.url).toBe('/x/lists/3/indicators');
    expect(el.textContent).toContain('Webroot sample');
    await harness.navigateByUrl('/x/lists/2/about');
    expect(el.querySelector('.about')?.textContent).toContain('Added by the SOC');
  });

  it('TODO 2: query params drive the filter', async () => {
    const { rows } = await setup('/x/lists/3/indicators?q=phish');
    expect(rows()).toEqual(['203.0.113.120', 'login-micr0soft.example']);
  });

  it('TODO 2: both params combine', async () => {
    const { rows } = await setup('/x/lists/3/indicators?type=DOMAIN&q=example');
    expect(rows()).toEqual(['crypto-miner.example', 'login-micr0soft.example', 'stats-tracker.example']);
  });

  it('TODO 3: setFilter merges into the URL and replaces history', async () => {
    const { router, harness, rows } = await setup('/x/lists/3/indicators?type=IP');
    const tab = harness.fixture.debugElement.query(d => d.componentInstance instanceof IndicatorsTab).componentInstance as IndicatorsTab;
    await tab.setFilter({ q: 'brute' });
    await harness.fixture.whenStable();
    expect(router.url).toBe('/x/lists/3/indicators?type=IP&q=brute');
    expect(rows()).toEqual(['203.0.113.45', '203.0.113.46']);
    await tab.setFilter({ type: '' });
    expect(router.url).toBe('/x/lists/3/indicators?q=brute');
    const nav = router.lastSuccessfulNavigation();
    expect(nav?.extras.replaceUrl).toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Page } from './page';
import { LIST_ROUTES } from './routes';
import { ListDetail } from './list-detail';

async function setup(url: string) {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'x', component: Page, children: LIST_ROUTES }], withComponentInputBinding())] });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  return { harness, el: harness.routeNativeElement as HTMLElement, router: TestBed.inject(Router) };
}

describe('M14.02 · params via input binding', () => {
  it('TODO 1: list index and detail routes', async () => {
    const { el, router, harness } = await setup('/x');
    expect(router.url).toBe('/x/lists');
    (el.querySelectorAll('a')[2] as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/x/lists/3');
  });

  it('TODO 2: the :listId param arrives as a number input', async () => {
    const { el } = await setup('/x/lists/3');
    expect(el.textContent).toContain('Webroot sample');
    expect(el.textContent).toContain('crypto-miner.example');
  });

  it('TODO 2: the SAME component instance follows param changes (no stale snapshot)', async () => {
    const { el, harness, router } = await setup('/x/lists/2');
    const before = harness.fixture.debugElement.query(d => d.componentInstance instanceof ListDetail).componentInstance;
    (el.querySelector('a.next') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/x/lists/3');
    const after = harness.fixture.debugElement.query(d => d.componentInstance instanceof ListDetail).componentInstance;
    expect(after).toBe(before);
    expect(el.textContent).toContain('Webroot sample');
    await harness.navigateByUrl('/x/lists/999');
    expect(el.textContent).toContain("List 999 doesn't exist");
  });
});

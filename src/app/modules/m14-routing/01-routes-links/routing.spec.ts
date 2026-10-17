import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { Page } from './page';
import { SECTION_ROUTES } from './routes';

async function setup(url: string) {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'console', component: Page, children: SECTION_ROUTES }])] });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  return { harness, el: harness.routeNativeElement as HTMLElement, router: TestBed.inject(Router) };
}

describe('M14.01 · routes & links', () => {
  it('TODO 1: empty path redirects to overview', async () => {
    const { el, router } = await setup('/console');
    expect(router.url).toBe('/console/overview');
    expect(el.textContent).toContain('open alerts');
  });

  it('TODO 1: sections, titles and the wildcard', async () => {
    const { el, harness } = await setup('/console/lists');
    expect(el.textContent).toContain('Partner allow list');
    expect(TestBed.inject(Title).getTitle()).toBe('Lists');
    await harness.navigateByUrl('/console/whatever');
    expect(el.textContent).toContain('404');
  });

  it('TODO 2: router links navigate without reloading and mark the active one', async () => {
    const { el, harness, router } = await setup('/console/overview');
    const links = [...el.querySelectorAll('nav a')] as HTMLAnchorElement[];
    expect(links[1].getAttribute('href')).toBe('/console/lists');
    links[2].click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/console/alerts');
    expect(links[2].classList).toContain('active');
    expect(links[2].getAttribute('aria-current')).toBe('page');
    expect(links[0].classList).not.toContain('active');
  });
});

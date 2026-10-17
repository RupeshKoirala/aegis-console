import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Page } from './page';
import { GUARDED_ROUTES } from './routes';
import { ConfirmService, DemoSession } from './session';
import { GNewList } from './sections';

let answer = false;
let asked: string[] = [];

async function setup(url = '/x/y') {
  asked = [];
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{ path: 'x/y', component: Page, children: GUARDED_ROUTES }]),
      { provide: ConfirmService, useValue: { ask: (m: string) => { asked.push(m); return answer; } } },
    ],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  const el = () => harness.routeNativeElement as HTMLElement;
  return { harness, el, router: TestBed.inject(Router), session: TestBed.inject(DemoSession) };
}

describe('M14.05 · guards', () => {
  it('TODO 1+4: canActivate redirects other roles to forbidden', async () => {
    const { harness, router, el, session } = await setup();
    await harness.navigateByUrl('/x/y/admin/users');
    expect(router.url).toBe('/x/y/forbidden');
    expect(el().querySelector('.forbidden')).toBeTruthy();
    session.role.set('ADMIN');
    await harness.navigateByUrl('/x/y/admin/users');
    expect(router.url).toBe('/x/y/admin/users');
    expect(el().querySelector('.users')).toBeTruthy();
  });

  it('TODO 2+4: canMatch falls through to the next route with the same path', async () => {
    const { harness, el, session } = await setup();
    await harness.navigateByUrl('/x/y/threat-map');
    expect(el().querySelector('.soon')).toBeTruthy();
    session.flags.set({ threatMap: true });
    await harness.navigateByUrl('/x/y/lists');
    await harness.navigateByUrl('/x/y/threat-map');
    expect(el().querySelector('.map')).toBeTruthy();
  });

  it('TODO 3+4: canDeactivate asks only when there are unsaved changes', async () => {
    const { harness, router } = await setup('/x/y/lists/new');
    await harness.navigateByUrl('/x/y/lists');
    expect(asked).toEqual([]);
    await harness.navigateByUrl('/x/y/lists/new');
    const form = harness.fixture.debugElement.query(d => d.componentInstance instanceof GNewList).componentInstance as GNewList;
    form.name.set('Incident 42');
    answer = false;
    await harness.navigateByUrl('/x/y/lists');
    expect(asked).toEqual(['Discard unsaved changes?']);
    expect(router.url).toBe('/x/y/lists/new');
    answer = true;
    await harness.navigateByUrl('/x/y/lists');
    expect(router.url).toBe('/x/y/lists');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Page } from './page';
import { AUTH_ROUTES } from './routes';
import { Can, Permissions } from './permissions';
import { Session } from '../shared/session';
import { Role } from '../../../shared/domain/models';

const signIn = (role: Role) => TestBed.inject(Session).start({
  token: 't', refreshToken: 'r', expiresIn: 900,
  user: { id: 1, email: `${role.toLowerCase()}@acme.test`, displayName: role, role, tenantId: 1, tenantName: 'Acme' },
});

async function setup() {
  TestBed.configureTestingModule({
    providers: [provideRouter([{ path: 'm/x', component: Page, children: AUTH_ROUTES }], withComponentInputBinding()), provideHttpClient(), provideHttpClientTesting()],
  });
  const harness = await RouterTestingHarness.create();
  return { harness, router: TestBed.inject(Router), el: () => harness.routeNativeElement as HTMLElement };
}

@Component({
  imports: [Can],
  template: `<button *aegisCan="'list:delete'; else ro" class="del">Delete</button><ng-template #ro><i class="ro">read only</i></ng-template>`,
})
class Host {}

describe('M15.03 · guards & permissions', () => {
  it('TODO 1: Permissions.allows follows the matrix', () => {
    TestBed.configureTestingModule({});
    const p = TestBed.inject(Permissions);
    expect(p.allows('indicator:write')).toBe(false);
    signIn('ANALYST');
    expect(p.allows('indicator:write')).toBe(true);
    expect(p.allows('list:delete')).toBe(false);
    signIn('ADMIN');
    expect(p.allows('user:manage')).toBe(true);
  });

  it('TODO 2: signed-out users go to login with a returnUrl', async () => {
    const { harness, router } = await setup();
    await harness.navigateByUrl('/m/x/console/lists');
    expect(router.url).toBe('/m/x/login?returnUrl=%2Fm%2Fx%2Fconsole%2Flists');
  });

  it('TODO 2: permissions guard the users page; child routes re-check sign-in', async () => {
    const { harness, router } = await setup();
    signIn('ANALYST');
    await harness.navigateByUrl('/m/x/console/users');
    expect(router.url).toBe('/m/x/forbidden');
    signIn('ADMIN');
    await harness.navigateByUrl('/m/x/console/users');
    expect(router.url).toBe('/m/x/console/users');
    TestBed.inject(Session).clear();
    await harness.navigateByUrl('/m/x/console/lists');
    expect(router.url).toContain('/m/x/login');
  });

  it('TODO 3: *aegisCan renders the right template and reacts to role changes', async () => {
    TestBed.configureTestingModule({});
    signIn('READ_ONLY');
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    expect(f.nativeElement.querySelector('.del')).toBeNull();
    expect(f.nativeElement.querySelector('.ro')).toBeTruthy();
    signIn('ADMIN');
    await f.whenStable();
    const del = f.nativeElement.querySelector('.del');
    expect(del).toBeTruthy();
    expect(f.nativeElement.querySelector('.ro')).toBeNull();
    TestBed.inject(Session).user.update(u => ({ ...u!, displayName: 'renamed' }));
    await f.whenStable();
    expect(f.nativeElement.querySelector('.del')).toBe(del);
  });

  it('TODO 4: login sends you back to returnUrl', async () => {
    const { harness, router } = await setup();
    await harness.navigateByUrl('/m/x/console/users');
    signIn('ADMIN');
    await harness.fixture.whenStable();
    await new Promise(r => setTimeout(r, 0));
    await harness.fixture.whenStable();
    expect(router.url).toBe('/m/x/console/users');
  });
});

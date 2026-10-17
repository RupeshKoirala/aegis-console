import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TenantContext, tenantInterceptor } from './tenant-context';
import { IDLE_CONFIG, IdleTimeout } from './idle-timeout';
import { Session } from '../shared/session';
import { Me } from '../../../shared/domain/models';

const msp: Me = { id: 5, email: 'msp@shieldline.test', displayName: 'Mo', role: 'ADMIN', tenantId: 3, tenantName: 'Shieldline MSP' };
const acme = { id: 1, name: 'Acme Schools', slug: 'acme', parentId: 3, createdAt: '' };
const signIn = (user: Me) => TestBed.inject(Session).start({ token: 't', refreshToken: 'r', expiresIn: 900, user });

describe('M15.04 · tenant switch', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([tenantInterceptor])), provideHttpClientTesting()] }));

  it('TODO 1: actingFor resets when the user changes', () => {
    const ctx = TestBed.inject(TenantContext);
    signIn(msp);
    ctx.actingFor.set(acme);
    expect(ctx.label()).toBe('Acme Schools');
    TestBed.inject(Session).clear();
    expect(ctx.actingFor()).toBeNull();
    signIn(msp);
    ctx.actingFor.set(acme);
    signIn({ ...msp, id: 6, email: 'other@shieldline.test' });
    expect(ctx.actingFor()).toBeNull();
    expect(ctx.label()).toBe('Shieldline MSP');
  });

  it('TODO 2: X-Tenant-Id only while acting for a child, never on auth calls', () => {
    const http = TestBed.inject(HttpClient);
    const ctl = TestBed.inject(HttpTestingController);
    const ctx = TestBed.inject(TenantContext);
    signIn(msp);
    TestBed.tick();
    ctl.match('/api/v1/tenants/children').forEach(r => r.flush([acme]));
    http.get('/api/v1/lists').subscribe();
    expect(ctl.expectOne('/api/v1/lists').request.headers.has('X-Tenant-Id')).toBe(false);
    ctx.actingFor.set(acme);
    http.get('/api/v1/lists').subscribe();
    http.post('/api/v1/auth/refresh', {}).subscribe();
    http.get('/assets/logo.svg').subscribe();
    expect(ctl.expectOne('/api/v1/lists').request.headers.get('X-Tenant-Id')).toBe('1');
    expect(ctl.expectOne('/api/v1/auth/refresh').request.headers.has('X-Tenant-Id')).toBe(false);
    expect(ctl.expectOne('/assets/logo.svg').request.headers.has('X-Tenant-Id')).toBe(false);
  });
});

describe('M15.04 · idle timeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [{ provide: IDLE_CONFIG, useValue: { timeoutMs: 30_000, warnMs: 10_000 } }] });
  });
  afterEach(() => vi.useRealTimers());

  it('TODO 3: warns in the last 10 s, then signs out', () => {
    signIn(msp);
    const idle = TestBed.inject(IdleTimeout);
    idle.start();
    vi.advanceTimersByTime(19_000);
    expect(idle.secondsLeft()).toBeNull();
    vi.advanceTimersByTime(2_000);
    expect(idle.secondsLeft()).toBe(9);
    vi.advanceTimersByTime(9_000);
    expect(idle.expired()).toBe(true);
    expect(idle.secondsLeft()).toBeNull();
    expect(TestBed.inject(Session).isAuthenticated()).toBe(false);
  });

  it('TODO 4: activity resets the countdown, but not after expiry', () => {
    signIn(msp);
    const idle = TestBed.inject(IdleTimeout);
    idle.start();
    vi.advanceTimersByTime(25_000);
    expect(idle.secondsLeft()).toBe(5);
    idle.activity();
    expect(idle.secondsLeft()).toBeNull();
    vi.advanceTimersByTime(25_000);
    expect(TestBed.inject(Session).isAuthenticated()).toBe(true);
    vi.advanceTimersByTime(6_000);
    expect(idle.expired()).toBe(true);
    idle.activity();
    vi.advanceTimersByTime(60_000);
    expect(idle.expired()).toBe(true);
  });
});

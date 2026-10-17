import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { AUTH_STORAGE, AuthService, STORAGE_KEY } from './auth.service';
import { LoginResponse, Session } from '../shared/session';

class MemoryStorage implements Storage {
  data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.get(k) ?? null; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  removeItem(k: string) { this.data.delete(k); }
  setItem(k: string, v: string) { this.data.set(k, v); }
}

const user = { id: 2, email: 'analyst@acme.test', displayName: 'Ana Analyst', role: 'ANALYST' as const, tenantId: 1, tenantName: 'Acme Schools' };
const ok: LoginResponse = { token: 'jwt-1', refreshToken: 'r-1', expiresIn: 900, user };

function setup(storage = new MemoryStorage()) {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: AUTH_STORAGE, useValue: storage }] });
  return { auth: TestBed.inject(AuthService), session: TestBed.inject(Session), http: TestBed.inject(HttpTestingController), storage };
}

describe('M15.01 · login & token storage', () => {
  it('TODO 1: login starts the session and emits the user', async () => {
    const { auth, session, http } = setup();
    const result = firstValueFrom(auth.login(' Analyst@acme.test ', 'password123'));
    const req = http.expectOne({ method: 'POST', url: '/api/v1/auth/login' });
    expect(req.request.body).toEqual({ email: 'analyst@acme.test', password: 'password123' });
    req.flush(ok);
    expect(await result).toEqual(user);
    expect(session.token()).toBe('jwt-1');
    expect(session.isAuthenticated()).toBe(true);
    expect(session.expiresAt()).toBeGreaterThan(Date.now() + 890_000);
  });

  it('TODO 1: a 401 surfaces the problem detail and starts nothing', async () => {
    const { auth, session, http } = setup();
    const result = firstValueFrom(auth.login('analyst@acme.test', 'wrong'));
    http.expectOne('/api/v1/auth/login').flush(
      { title: 'Unauthorized', status: 401, detail: 'Wrong email or password', instance: '/api/v1/auth/login' }, { status: 401, statusText: 'Unauthorized' });
    await expect(result).rejects.toMatchObject({ status: 401, detail: 'Wrong email or password' });
    expect(session.isAuthenticated()).toBe(false);
  });

  it('TODO 2: logout revokes with the session token and always clears', async () => {
    const { auth, session, http } = setup();
    session.start(ok);
    const done = firstValueFrom(auth.logout(), { defaultValue: undefined });
    const req = http.expectOne({ method: 'POST', url: '/api/v1/auth/logout' });
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-1');
    req.flush(null, { status: 500, statusText: 'Boom' });
    await done;
    expect(session.isAuthenticated()).toBe(false);
  });

  it('TODO 3: the session is persisted and restored', () => {
    const { session, storage } = setup();
    session.start(ok);
    TestBed.tick();
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toMatchObject({ token: 'jwt-1', refreshToken: 'r-1', user });
    session.clear();
    TestBed.tick();
    expect(storage.getItem(STORAGE_KEY)).toBeNull();

    TestBed.resetTestingModule();
    const saved = new MemoryStorage();
    saved.setItem(STORAGE_KEY, JSON.stringify({ token: 'jwt-9', refreshToken: 'r-9', user, expiresAt: Date.now() + 60_000 }));
    const restored = setup(saved);
    expect(restored.session.token()).toBe('jwt-9');
    expect(restored.session.role()).toBe('ANALYST');
  });

  it('TODO 3: expired or corrupted storage is discarded', () => {
    const saved = new MemoryStorage();
    saved.setItem(STORAGE_KEY, JSON.stringify({ token: 'old', refreshToken: 'r', user, expiresAt: Date.now() - 1 }));
    const a = setup(saved);
    expect(a.session.isAuthenticated()).toBe(false);
    expect(saved.getItem(STORAGE_KEY)).toBeNull();
    TestBed.resetTestingModule();
    const bad = new MemoryStorage();
    bad.setItem(STORAGE_KEY, '{nope');
    const b = setup(bad);
    expect(b.session.isAuthenticated()).toBe(false);
    expect(bad.getItem(STORAGE_KEY)).toBeNull();
  });
});

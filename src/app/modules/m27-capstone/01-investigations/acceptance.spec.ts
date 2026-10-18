// ACCEPTANCE TESTS for the capstone. They check WHAT the feature does (README requirements R1–R7), through the
// router, the DOM and HTTP, not how you built it. When they're all green, the feature ships.
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Page } from './page';
import { INVESTIGATION_ROUTES } from './routes';
import { InvestigationStore } from './investigation.store';
import { InvestigationApi } from './investigation.api';
import { INDICATORS, LISTS } from '../../../shared/domain/sample-data';
import { Me, Role } from '../../../shared/domain/models';

const me = (role: Role): Me => ({ id: 1, email: 'x@acme.test', displayName: 'X', role, tenantId: 1, tenantName: 'Acme Schools' });
const MANUAL = LISTS[1];
const ROWS = INDICATORS.filter(i => i.listId === 2);
const wait = (ms = 0) => new Promise(r => setTimeout(r, ms));

async function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(), provideHttpClientTesting(),
      provideRouter([{ path: 'm27/01', component: Page, providers: [InvestigationStore], children: INVESTIGATION_ROUTES }], withComponentInputBinding()),
    ],
  });
  const harness = await RouterTestingHarness.create();
  const http = TestBed.inject(HttpTestingController);
  const el = () => harness.routeNativeElement as HTMLElement;
  const settle = async () => { await wait(); await harness.fixture.whenStable(); };
  return { harness, http, el, settle, router: TestBed.inject(Router) };
}

/** opens /m27/01/lists/2 as <role>, answering the resolver, /me and the first indicators load */
async function openManualBlocks(role: Role = 'ANALYST') {
  const s = await setup();
  const nav = s.harness.navigateByUrl('/m27/01/lists/2');
  await wait();
  s.http.expectOne('/api/v1/lists/2').flush(MANUAL);
  await nav;
  await s.settle();
  s.http.match('/api/v1/me').forEach(r => r.flush(me(role)));
  s.http.expectOne(r => r.url === '/api/v1/lists/2/indicators').flush({ items: ROWS, page: 0, size: 200, total: ROWS.length });
  await s.settle();
  const values = () => [...s.el().querySelectorAll('.value-cell')].map(e => e.textContent);
  return { ...s, values };
}

describe('M27 · capstone acceptance', () => {
  it('R1: the API service', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const api = TestBed.inject(InvestigationApi);
    const http = TestBed.inject(HttpTestingController);
    api.verdict('evil.example').subscribe();
    expect(http.expectOne(r => r.url === '/api/v1/verdict').request.params.get('q')).toBe('evil.example');
    let rows: unknown;
    api.indicators(2, '').subscribe(r => (rows = r));
    const req = http.expectOne(r => r.url === '/api/v1/lists/2/indicators');
    expect(req.request.params.get('size')).toBe('200');
    expect(req.request.params.has('q')).toBe(false);
    req.flush({ items: ROWS, page: 0, size: 200, total: 4 });
    expect(rows).toEqual(ROWS);
    api.add(2, { value: '1.2.3.4' }).subscribe();
    expect(http.expectOne({ method: 'POST', url: '/api/v1/lists/2/indicators' }).request.body).toEqual({ value: '1.2.3.4' });
    api.remove(2, 5).subscribe();
    http.expectOne({ method: 'DELETE', url: '/api/v1/lists/2/indicators/5' });
    api.me().subscribe();
    http.expectOne('/api/v1/me');
    api.list(2).subscribe();
    http.expectOne('/api/v1/lists/2');
  });

  it('R4 + R7: the lookup reads ?q=, asks the API, and links to the matching lists', async () => {
    const { harness, http, el, settle, router } = await setup();
    await harness.navigateByUrl('/m27/01');
    expect(router.url).toBe('/m27/01/lookup');
    // whenStable() waits for pending HTTP, so start the navigation, answer the request, THEN await it.
    const nav = harness.navigateByUrl('/m27/01/lookup?q=evil.example');
    await wait(20);
    http.match('/api/v1/me').forEach(r => r.flush(me('ANALYST')));
    http.expectOne(r => r.url === '/api/v1/verdict' && r.params.get('q') === 'evil.example').flush({
      query: 'evil.example', type: 'DOMAIN', verdict: 'BLOCK', reason: 'BLOCK_LIST', threshold: 90, engine: 'fake',
      matches: [{ listId: 2, listName: 'Manual blocks', kind: 'BLOCK', value: 'evil.example', category: null, score: null }],
    });
    await nav;
    await settle();
    expect(el().querySelector('.verdict')?.textContent).toBe('BLOCK');
    expect(el().querySelector('.reason')?.textContent).toBe('BLOCK_LIST');
    expect(el().querySelector('a.match')?.getAttribute('href')).toBe('/m27/01/lists/2');
  });

  it('R4: invalid input sends nothing; submitting puts the query in the URL', async () => {
    const { harness, http, el, settle, router } = await setup();
    await harness.navigateByUrl('/m27/01/lookup?q=10.0.0.0/8');
    await settle();
    expect(el().querySelector('.invalid')).toBeTruthy();
    http.expectNone(r => r.url === '/api/v1/verdict');
    const input = el().querySelector('input.q') as HTMLInputElement;
    input.value = ' 203.0.113.66 '; input.dispatchEvent(new Event('input'));
    (el().querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await wait(20);
    expect(router.url).toBe('/m27/01/lookup?q=203.0.113.66');
    http.expectOne(r => r.url === '/api/v1/verdict' && r.params.get('q') === '203.0.113.66')
      .flush({ query: '203.0.113.66', type: 'IP', verdict: 'BLOCK', reason: 'THREAT_SCORE', threshold: 90, matches: [], engine: 'fake' });
    await settle();
    expect(el().querySelector('.reason')?.textContent).toBe('THREAT_SCORE');
  });

  it('R7: a missing list goes back to the lookup', async () => {
    const { harness, http, router } = await setup();
    const nav = harness.navigateByUrl('/m27/01/lists/999');
    await wait();
    http.expectOne('/api/v1/lists/999').flush({ title: 'Not Found', status: 404, detail: 'List 999 not found', instance: '' }, { status: 404, statusText: 'x' });
    await nav;
    expect(router.url).toBe('/m27/01/lookup');
  });

  it('R2 + R3: the list page loads its indicators and filters server-side (debounced)', async () => {
    const { el, http, settle, values } = await openManualBlocks();
    expect(el().querySelector('.list-name')?.textContent).toContain('Manual blocks');
    expect(values()).toEqual(ROWS.map(r => r.value));
    const filter = el().querySelector('input.filter') as HTMLInputElement;
    filter.value = 'evil'; filter.dispatchEvent(new Event('input'));
    await settle();
    http.expectNone(r => r.url === '/api/v1/lists/2/indicators');
    await wait(320);
    http.expectOne(r => r.url === '/api/v1/lists/2/indicators' && r.params.get('q') === 'evil')
      .flush({ items: ROWS.filter(r => r.value.includes('evil')), page: 0, size: 200, total: 1 });
    await settle();
    expect(values()).toEqual(['evil.example']);
  });

  it('R5: adding shows the new row; server validation errors land on the form', async () => {
    const { el, http, settle, values } = await openManualBlocks();
    const value = el().querySelector('input.value') as HTMLInputElement;
    const submit = async (v: string) => {
      value.value = v; value.dispatchEvent(new Event('input'));
      await settle();
      (el().querySelector('form.add') as HTMLFormElement).dispatchEvent(new Event('submit'));
      await settle();
    };
    await submit('300.1.1.1');
    http.expectOne({ method: 'POST', url: '/api/v1/lists/2/indicators' })
      .flush({ title: 'Bad Request', status: 400, detail: 'Validation failed', instance: '', errors: { value: 'must be an IPv4 address, IPv4 CIDR or domain name' } }, { status: 400, statusText: 'x' });
    await settle();
    expect(el().querySelector('.value-error')?.textContent).toContain('must be an IPv4 address');
    await submit('203.0.113.7');
    http.expectOne({ method: 'POST', url: '/api/v1/lists/2/indicators' })
      .flush({ title: 'Conflict', status: 409, detail: '203.0.113.7 is already on this list', instance: '' }, { status: 409, statusText: 'x' });
    await settle();
    expect(el().querySelector('.add-error')?.textContent).toContain('already on this list');
    expect(el().querySelector('.value-error')).toBeNull();
    await submit('203.0.113.99');
    const ok = http.expectOne({ method: 'POST', url: '/api/v1/lists/2/indicators' });
    expect(ok.request.body).toEqual({ value: '203.0.113.99', description: null });
    ok.flush({ ...ROWS[0], id: 99, value: '203.0.113.99' }, { status: 201, statusText: 'Created' });
    await settle();
    expect(values()[0]).toBe('203.0.113.99');
    expect(el().querySelector('.add-error')).toBeNull();
  });

  it('R6: remove is optimistic and rolls back on failure', async () => {
    const { el, http, settle, values } = await openManualBlocks();
    (el().querySelectorAll('button.remove')[1] as HTMLButtonElement).click();
    await settle();
    expect(values()).not.toContain(ROWS[1].value);
    http.expectOne({ method: 'DELETE', url: `/api/v1/lists/2/indicators/${ROWS[1].id}` })
      .flush({ title: 'Forbidden', status: 403, detail: 'Requires role ADMIN or ANALYST', instance: '' }, { status: 403, statusText: 'x' });
    await settle();
    expect(values()).toEqual(ROWS.map(r => r.value));
    expect(el().querySelector('.list-error')?.textContent).toContain('Requires role ADMIN or ANALYST');
  });

  it('R2: READ_ONLY users can look but not touch', async () => {
    const { el } = await openManualBlocks('READ_ONLY');
    expect(el().querySelector('form.add')).toBeNull();
    expect(el().querySelector('.read-only')).toBeTruthy();
    expect(el().querySelectorAll('button.remove').length).toBe(0);
  });
});

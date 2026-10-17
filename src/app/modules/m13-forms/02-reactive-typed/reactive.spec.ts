import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, Observable } from 'rxjs';
import { indicatorValidator, threatNeedsScore, uniqueOnList } from './indicator-validators';
import { Page } from './page';

const group = (listKind: string, category = '', score: number | null = null) =>
  new FormGroup({ listKind: new FormControl(listKind), category: new FormControl(category), score: new FormControl(score) });

describe('M13.02 · reactive typed forms', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }));

  it('TODO 1: indicatorValidator', () => {
    expect(indicatorValidator(new FormControl(''))).toBeNull();
    expect(indicatorValidator(new FormControl('203.0.113.7'))).toBeNull();
    expect(indicatorValidator(new FormControl('198.51.100.0/24'))).toBeNull();
    expect(indicatorValidator(new FormControl('Evil.Example'))).toBeNull();
    expect(indicatorValidator(new FormControl('300.1.1.1'))).toEqual({ indicator: { value: '300.1.1.1' } });
    expect(indicatorValidator(new FormControl('10.0.0.0/33'))).toEqual({ indicator: { value: '10.0.0.0/33' } });
  });

  it('TODO 2: threatNeedsScore is a cross-field group validator', () => {
    expect(threatNeedsScore(group('BLOCK'))).toBeNull();
    expect(threatNeedsScore(group('THREAT'))).toEqual({ threatFields: ['category', 'score'] });
    expect(threatNeedsScore(group('THREAT', 'Phishing', 101))).toEqual({ threatFields: ['score'] });
    expect(threatNeedsScore(group('THREAT', 'Phishing', 80))).toBeNull();
  });

  it('TODO 3: uniqueOnList asks the API', async () => {
    const http = TestBed.inject(HttpTestingController);
    const v = uniqueOnList(TestBed.inject(HttpClient), () => 2);
    const dup = firstValueFrom(v(new FormControl(' Evil.Example ')) as Observable<unknown>);
    const req = http.expectOne(r => r.url === '/api/v1/lists/2/indicators');
    expect(req.request.params.get('q')).toBe('evil.example');
    req.flush({ items: [{ value: 'evil.example.org' }, { value: 'evil.example' }], page: 0, size: 200, total: 2 });
    expect(await dup).toEqual({ duplicate: true });

    const near = firstValueFrom(v(new FormControl('evil.exa')) as Observable<unknown>);
    http.expectOne(r => r.url === '/api/v1/lists/2/indicators').flush({ items: [{ value: 'evil.example' }], page: 0, size: 200, total: 1 });
    expect(await near).toBeNull();

    const down = firstValueFrom(v(new FormControl('x.example')) as Observable<unknown>);
    http.expectOne(() => true).flush(null, { status: 503, statusText: 'Down' });
    expect(await down).toBeNull();

    expect(await firstValueFrom(v(new FormControl('')) as Observable<unknown>)).toBeNull();
    http.verify();
  });

  it('TODO 4: the page form uses all three validators', async () => {
    const page = TestBed.runInInjectionContext(() => new Page());
    const http = TestBed.inject(HttpTestingController);
    const f = page.form;
    expect(f.valid).toBe(false);
    f.controls.value.setValue('nope!');
    expect(f.controls.value.hasError('indicator')).toBe(true);
    f.controls.listKind.setValue('THREAT');
    f.controls.value.setValue('203.0.113.9');
    http.expectOne(r => r.url === '/api/v1/lists/3/indicators').flush({ items: [], page: 0, size: 200, total: 0 });
    expect(f.hasError('threatFields')).toBe(true);
    f.patchValue({ category: 'Botnets', score: 90 });
    expect(f.valid).toBe(true);
    http.verify();
  });
});

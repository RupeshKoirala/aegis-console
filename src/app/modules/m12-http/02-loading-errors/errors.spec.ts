import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { toProblem } from './problem';
import { Page } from './page';
import { LISTS } from '../../../shared/domain/sample-data';

describe('M12.02 · loading & errors', () => {
  it('TODO 1: toProblem handles every kind of failure', () => {
    const problem = { title: 'Bad Request', status: 400, detail: 'Validation failed', instance: '/x', errors: { score: 'bad' } };
    expect(toProblem(new HttpErrorResponse({ status: 400, error: problem }))).toEqual(problem);
    expect(toProblem(new HttpErrorResponse({ status: 0, url: '/api/v1/lists' }))).toEqual(
      { title: 'Server unreachable', status: 0, detail: 'Check your connection and try again.', instance: '/api/v1/lists' });
    expect(toProblem(new HttpErrorResponse({ status: 502, statusText: 'Bad Gateway', error: '<html>', url: '/y' }))).toEqual(
      { title: 'Bad Gateway', status: 502, detail: 'Request failed with status 502', instance: '/y' });
    expect(toProblem(new Error('kaput'))).toEqual({ title: 'Unexpected error', status: -1, detail: 'kaput', instance: '' });
  });

  describe('store + page', () => {
    let http: HttpTestingController;
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
      http = TestBed.inject(HttpTestingController);
    });

    it('TODO 2–4: loading → success → error (keeping stale data) → retry', async () => {
      const f = TestBed.createComponent(Page);
      f.detectChanges();
      const el: HTMLElement = f.nativeElement;
      expect(el.querySelector('.loading')).not.toBeNull();
      http.expectOne('/api/v1/lists').flush(LISTS);
      await f.whenStable();
      expect(el.querySelectorAll('.list').length).toBe(4);
      expect(el.querySelector('.loading')).toBeNull();

      (el.querySelector('button.fail') as HTMLElement).click();
      http.expectOne('/api/v1/lists?_fail=500').flush(
        { title: 'Simulated failure', status: 500, detail: 'You asked for ?_fail=500', instance: '/api/v1/lists' },
        { status: 500, statusText: 'Server Error' });
      await f.whenStable();
      expect(el.querySelector('.problem .title')?.textContent).toBe('Simulated failure');
      expect(el.querySelectorAll('.list').length, 'keep stale data on error').toBe(4);

      (el.querySelector('.problem .retry') as HTMLElement).click();
      http.expectOne('/api/v1/lists').flush([]);
      await f.whenStable();
      expect(el.querySelector('.problem')).toBeNull();
      expect(el.querySelector('.empty')).not.toBeNull();
    });
  });
});

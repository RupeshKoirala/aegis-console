import { TestBed } from '@angular/core/testing';
import { provideRouter, Route, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom, of } from 'rxjs';
import { Page } from './page';
import { LAZY_ROUTES } from './routes';
import { OptInPreloading } from './preloading';

describe('M14.06 · lazy loading & preloading', () => {
  it('TODO 1: admin and reports are lazy routes', () => {
    const admin = LAZY_ROUTES.find(r => r.path === 'admin');
    const reports = LAZY_ROUTES.find(r => r.path === 'reports');
    expect(admin?.loadChildren).toBeTypeOf('function');
    expect(admin?.children).toBeUndefined();
    expect(admin?.data?.['preload']).toBe(true);
    expect(reports?.loadComponent).toBeTypeOf('function');
    expect(reports?.component).toBeUndefined();
  });

  it('TODO 1: lazy routes render', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'x', component: Page, children: LAZY_ROUTES }])] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/x/admin/audit');
    expect(TestBed.inject(Router).url).toBe('/x/admin/audit');
    expect((harness.routeNativeElement as HTMLElement).querySelector('.audit')).toBeTruthy();
    await harness.navigateByUrl('/x/reports');
    expect((harness.routeNativeElement as HTMLElement).querySelector('.reports')).toBeTruthy();
  });

  it('TODO 2: opt-in preloading', async () => {
    const strategy = TestBed.inject(OptInPreloading);
    let loads = 0;
    const load = () => { loads++; return of('chunk'); };
    expect(await firstValueFrom(strategy.preload({ path: 'a', data: { preload: true } } as Route, load))).toBe('chunk');
    expect(await firstValueFrom(strategy.preload({ path: 'b' } as Route, load))).toBeNull();
    expect(loads).toBe(1);
    Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true });
    expect(await firstValueFrom(strategy.preload({ path: 'a', data: { preload: true } } as Route, load))).toBeNull();
    delete (navigator as { connection?: unknown }).connection;
  });
});

import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { LifecycleLog } from './lifecycle-log';

describe('M05.04 · lifecycle', () => {
  it('TODO 1–2: hooks run in the documented order', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const log = TestBed.inject(LifecycleLog).entries();
    expect(log.slice(0, 8)).toEqual([
      'constructor', 'ngOnChanges(label)', 'ngOnInit', 'ngDoCheck',
      'ngAfterContentInit', 'ngAfterContentChecked', 'ngAfterViewInit', 'ngAfterViewChecked',
    ]);
  });

  it('TODO 4: afterNextRender runs once after the DOM is rendered', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const log = TestBed.inject(LifecycleLog).entries();
    expect(log.filter(e => e === 'afterNextRender').length).toBe(1);
    expect(log.indexOf('afterNextRender')).toBeGreaterThan(log.indexOf('ngAfterViewInit'));
  });

  it('TODO 2: ngOnChanges fires again when the input changes', async () => {
    const f = TestBed.createComponent(Page);
    const log = TestBed.inject(LifecycleLog);
    await f.whenStable();
    log.clear();
    (f.nativeElement.querySelector('button.rename') as HTMLElement).click();
    await f.whenStable();
    expect(log.entries()[0]).toBe('ngOnChanges(label)');
    expect(log.entries()).not.toContain('ngOnInit');
  });

  it('TODO 2–3: destroying logs ngOnDestroy and the DestroyRef callback', async () => {
    const f = TestBed.createComponent(Page);
    const log = TestBed.inject(LifecycleLog);
    await f.whenStable();
    log.clear();
    (f.nativeElement.querySelector('button.toggle') as HTMLElement).click();
    await f.whenStable();
    expect(log.entries()).toEqual(expect.arrayContaining(['ngOnDestroy', 'DestroyRef']));
  });
});

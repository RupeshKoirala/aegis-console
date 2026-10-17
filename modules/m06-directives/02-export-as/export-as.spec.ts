import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Page } from './page';
import { CopyDirective } from './copy.directive';

describe('M06.02 · exportAs', () => {
  let writeText: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });
  afterEach(() => vi.useRealTimers());

  it('TODO 1: exports itself as "aegisCopy"', () => {
    expect((CopyDirective as any).ɵdir.exportAs).toEqual(['aegisCopy']);
  });

  it('TODO 2 + 4: clicking copies and the template shows the state for 2 s', async () => {
    vi.useFakeTimers();
    const f = TestBed.createComponent(Page);
    f.detectChanges();
    const btn = f.nativeElement.querySelector('button.copy') as HTMLElement;
    btn.click();
    f.detectChanges();
    expect(writeText).toHaveBeenCalledWith('192.0.2.10');
    expect(btn.textContent).toContain('✓ Copied');
    vi.advanceTimersByTime(2000);
    f.detectChanges();
    expect(btn.textContent).toContain('Copy');
    expect(btn.textContent).not.toContain('✓');
  });

  it('TODO 3: the timer is cleared on destroy (copied never resets afterwards)', async () => {
    vi.useFakeTimers();
    const f = TestBed.createComponent(Page);
    f.detectChanges();
    const dirEl = f.debugElement.query(By.directive(CopyDirective));
    const dir = dirEl.injector.get(CopyDirective);
    (dirEl.nativeElement as HTMLElement).click();
    expect(dir.copied()).toBe(true);
    f.destroy();
    vi.advanceTimersByTime(3000);
    expect(dir.copied(), 'the 2 s timer still fired after destroy').toBe(true);
  });
});

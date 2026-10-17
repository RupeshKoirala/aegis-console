import { TestBed } from '@angular/core/testing';
import { Page } from './page';

describe('M08.01 · injector tree', () => {
  it('TODO 2: the two shared counters use the page instance', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const btns = f.nativeElement.querySelectorAll('.shared button.inc');
    btns[0].click();
    btns[1].click();
    await f.whenStable();
    expect(btns[0].textContent).toContain('Edge FW 1: 2');
    expect(btns[1].textContent).toContain('Edge FW 2: 2');
  });

  it('TODO 1: isolated counters each have their own instance', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const btns = f.nativeElement.querySelectorAll('.isolated button.inc');
    btns[0].click();
    btns[0].click();
    btns[1].click();
    await f.whenStable();
    expect(btns[0].textContent).toContain('Tenant A: 2');
    expect(btns[1].textContent).toContain('Tenant B: 1');
    const ids = Array.from(f.nativeElement.querySelectorAll('button.inc small')).map((s: any) => s.textContent);
    expect(new Set(ids).size, 'shared ×1 + isolated ×2 = 3 distinct instances').toBe(3);
  });
});

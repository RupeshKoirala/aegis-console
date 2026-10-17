import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { checks } from './point-row';

describe('M09.02 · render cost', () => {
  it('TODO 1: header ticks do not re-check 200 unchanged rows', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    checks.total = 0;
    for (let i = 0; i < 10; i++) {
      f.componentInstance.tick();
      await f.whenStable();
    }
    expect(checks.total, `rows were checked ${checks.total} times for 10 header ticks`).toBe(0);
  });
});

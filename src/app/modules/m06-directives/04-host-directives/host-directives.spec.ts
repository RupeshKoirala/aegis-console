import { TestBed } from '@angular/core/testing';
import { Page } from './page';

describe('M06.04 · hostDirectives', () => {
  it('TODO 1–2: chips get the tooltip via the "tip" alias and are focusable', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const chip = f.nativeElement.querySelector('aegis-indicator-chip') as HTMLElement;
    expect(chip.getAttribute('title')).toBe('Botnets · score 97');
    expect(chip.getAttribute('aria-label')).toBe('Botnets · score 97');
    expect(chip.getAttribute('tabindex')).toBe('0');
    expect(chip.classList).toContain('focusable');
  });

  it('TODO 1–2: Enter on a chip emits the re-exposed activated output', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const chips = f.nativeElement.querySelectorAll('aegis-indicator-chip');
    chips[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await f.whenStable();
    expect(f.nativeElement.querySelector('.opened').textContent).toContain('203.0.113.120');
  });
});

import { TestBed } from '@angular/core/testing';
import { LegacyPanel } from './legacy-panel';
import { ModernPanel } from './modern-panel';

type AnimMeta = { name: string; definitions: { type: number; expr?: string; name?: string }[] };
const legacy = () => ((LegacyPanel as unknown as { ɵcmp: { data: { animation: AnimMeta[] } } }).ɵcmp.data.animation)[0];
const modernCss = () => (ModernPanel as unknown as { ɵcmp: { styles: string[] } }).ɵcmp.styles.join('\n');

describe('M21.02 · legacy → native', () => {
  it('TODO 1: the legacy trigger animates both directions', () => {
    const transitions = legacy().definitions.filter(d => d.expr).map(d => d.expr);
    expect(transitions).toEqual(['collapsed => expanded', 'expanded => collapsed']);
  });

  it('TODO 2: the port uses no @angular/animations metadata', () => {
    const data = (ModernPanel as unknown as { ɵcmp: { data: { animation?: unknown[] } } }).ɵcmp.data;
    expect(data.animation ?? []).toEqual([]);
    expect(modernCss()).toMatch(/grid-template-rows:\s*0fr/);
    expect(modernCss()).toMatch(/\.open[^{]*\{[^}]*grid-template-rows:\s*1fr/);
    expect(modernCss()).toMatch(/prefers-reduced-motion/);
  });

  it('TODO 2: the content stays in the DOM (so it can transition) and the state is exposed', async () => {
    const f = TestBed.createComponent(ModernPanel);
    f.autoDetectChanges();
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    const body = () => el.querySelector('.body') as HTMLElement;
    const btn = el.querySelector('button.header') as HTMLButtonElement;
    expect(body()).toBeTruthy();
    expect(body().classList).not.toContain('open');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    btn.click();
    await f.whenStable();
    expect(body().classList).toContain('open');
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});

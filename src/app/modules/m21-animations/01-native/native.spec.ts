import { AnimationCallbackEvent } from '@angular/core';
import { ToastCard } from './toast-card';
import { slideOut } from './motion';

// Animations don't run under jsdom, so these tests check what the compiler generated and call the leave function directly.
type Cmp = { ɵcmp: { hostBindings?: () => void; styles: string[] } };
const hostCode = () => String((ToastCard as unknown as Cmp).ɵcmp.hostBindings);
const css = () => (ToastCard as unknown as Cmp).ɵcmp.styles.join('\n');

function fakeEvent() {
  let resolve!: () => void;
  const finished = new Promise<void>(r => (resolve = r));
  const target = { animate: vi.fn(() => ({ finished })) } as unknown as HTMLElement;
  const animationComplete = vi.fn();
  return { event: { target, animationComplete } as unknown as AnimationCallbackEvent, target, animationComplete, finish: () => resolve() };
}

describe('M21.01 · native animations', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('TODO 1: the host animates on enter (class) and leave (function)', () => {
    expect(hostCode()).toContain('animateEnter("toast-in")');
    expect(hostCode()).toContain('animateLeaveListener');
  });

  it('TODO 2: the CSS defines the enter animation and respects reduced motion', () => {
    expect(css()).toMatch(/\.toast-in/);
    expect(css()).toMatch(/@keyframes\s+\S*toast-in/); // Angular scopes keyframe names per component
    expect(css()).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it('TODO 3: slideOut animates, THEN completes', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const { event, target, animationComplete, finish } = fakeEvent();
    slideOut(event);
    expect(target.animate).toHaveBeenCalledWith(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(40px)' }],
      { duration: 200, easing: 'ease-in' },
    );
    expect(animationComplete).not.toHaveBeenCalled();
    finish();
    await Promise.resolve(); await Promise.resolve();
    expect(animationComplete).toHaveBeenCalledOnce();
  });

  it('TODO 3: with reduced motion it completes immediately', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const { event, target, animationComplete } = fakeEvent();
    slideOut(event);
    expect(target.animate).not.toHaveBeenCalled();
    expect(animationComplete).toHaveBeenCalledOnce();
  });
});

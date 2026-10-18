import { AnimationCallbackEvent } from '@angular/core';

/** Done for you: does the user ask the OS for less motion? (vestibular disorders, migraines, preference) */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * TODO 3: the FUNCTION form of a leave animation, for when CSS classes aren't enough (measure first, chain, physics…).
 * Angular keeps the element in the DOM until you call event.animationComplete().
 *   - reduced motion → call animationComplete() immediately, no animation
 *   - otherwise → event.target.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(40px)' }],
 *                  { duration: 200, easing: 'ease-in' }).finished.then(() => event.animationComplete())
 */
export function slideOut(event: AnimationCallbackEvent): void {
//@@sol
  if (prefersReducedMotion()) {
    event.animationComplete();
    return;
  }
  event.target
    .animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(40px)' }], { duration: 200, easing: 'ease-in' })
    .finished.then(() => event.animationComplete());
//@@stub
  event.animationComplete();
//@@end
}

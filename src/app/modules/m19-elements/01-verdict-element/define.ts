import { Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { VerdictBadge } from './verdict-badge';

export const TAG = 'aegis-verdict';

/**
 * TODO 1: register <aegis-verdict> with the browser:
 *   const el = createCustomElement(VerdictBadge, { injector });   // wraps the component in a custom-element class
 *   customElements.define(TAG, el);
 * Defining the same tag twice THROWS, so only define it when customElements.get(TAG) is undefined.
 * Return true if this call defined it, false if it already existed.
 */
export function defineVerdictElement(injector: Injector): boolean {
  if (customElements.get(TAG)) return false;
  customElements.define(TAG, createCustomElement(VerdictBadge, { injector }));
  return true;
}

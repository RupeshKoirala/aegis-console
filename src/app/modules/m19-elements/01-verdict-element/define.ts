import { Injector } from '@angular/core';

export const TAG = 'aegis-verdict';

/**
 * TODO 1: register <aegis-verdict> with the browser:
 *   const el = createCustomElement(VerdictBadge, { injector });   // wraps the component in a custom-element class
 *   customElements.define(TAG, el);
 * Defining the same tag twice THROWS, so only define it when customElements.get(TAG) is undefined.
 * Return true if this call defined it, false if it already existed.
 */
export function defineVerdictElement(injector: Injector): boolean {
  return false;
}

import { Component, InjectionToken, inject } from '@angular/core';

export const TENANT_THEME = new InjectionToken<string>('tenant.theme');

/** Reports whether a theme was provided ON THIS element (self) and whether ANY ancestor provided one. */
@Component({
  selector: 'aegis-theme-probe',
  template: `<p class="probe">own: {{ own ?? 'none' }} · inherited: {{ inherited ?? 'none' }}</p>`,
})
export class ThemeProbe {
  protected readonly own = inject(TENANT_THEME, { self: true, optional: true });
  protected readonly inherited = inject(TENANT_THEME, { skipSelf: true, optional: true });
}

@Component({
  selector: 'aegis-dark-probe',
  imports: [ThemeProbe],
  providers: [{ provide: TENANT_THEME, useValue: 'dark' }],
  template: `<aegis-theme-probe class="child" />`,
})
export class DarkProbeWrapper {}

@Component({
  selector: 'aegis-own-theme-probe',
  providers: [{ provide: TENANT_THEME, useValue: 'contrast' }],
  template: ``,
})
export class OwnThemeHost {}

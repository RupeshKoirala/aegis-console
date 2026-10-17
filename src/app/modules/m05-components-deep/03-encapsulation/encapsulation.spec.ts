import { TestBed } from '@angular/core/testing';
import { ViewEncapsulation } from '@angular/core';
import { SeverityBadge } from './severity-badge';
import { ShadowBadge } from './shadow-badge';
import { GlobalReset } from './global-reset';

const css = (cls: unknown) => ((cls as any).ɵcmp.styles as string[]).join('\n').replace(/\s+/g, ' ');

describe('M05.03 · encapsulation', () => {
  it('TODO 1: :host compiles to the host attribute selector', () => {
    expect(css(SeverityBadge)).toMatch(/\[_nghost-%COMP%\]\s*\{[^}]*inline-flex/);
  });

  it('TODO 2: :host(.compact) and :host-context(.dark-tenant)', () => {
    expect(css(SeverityBadge)).toContain('.compact[_nghost-%COMP%]');
    expect(css(SeverityBadge)).toContain('.dark-tenant [_nghost-%COMP%]');
  });

  it('TODO 3: ::ng-deep drops the content attribute for <b>', () => {
    expect(css(SeverityBadge)).toMatch(/\[_nghost-%COMP%\]\s+b\s*\{/);
  });

  it('TODO 4: ShadowBadge renders into a shadow root', async () => {
    expect((ShadowBadge as any).ɵcmp.encapsulation).toBe(ViewEncapsulation.ShadowDom);
    const f = TestBed.createComponent(ShadowBadge);
    await f.whenStable();
    expect(f.nativeElement.shadowRoot?.querySelector('.badge')).toBeTruthy();
  });

  it('TODO 5: GlobalReset styles are not scoped', () => {
    expect((GlobalReset as any).ɵcmp.encapsulation).toBe(ViewEncapsulation.None);
    expect(css(GlobalReset)).not.toContain('%COMP%');
  });
});

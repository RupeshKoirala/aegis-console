import { Component } from '@angular/core';

@Component({
  selector: 'aegis-tenant-badge',
  template: `<span class="badge">🏫 Acme Schools <small>managed by Shieldline MSP</small></span>`,
  styles: `
    .badge { display: inline-flex; gap: 8px; align-items: center; padding: 4px 12px; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); }
    small { color: var(--muted); }
  `,
})
export class TenantBadge {}

/* ── The same component across Angular generations ──────────────────────────────
 * Gen 1 · v2–v15: components were NOT standalone. They had to be declared in an NgModule:
 *     @Component({ selector: 'aegis-tenant-badge', template: `…` })
 *     export class TenantBadge {}
 *     @NgModule({ declarations: [TenantBadge], exports: [TenantBadge] })
 *     export class SharedModule {}           // other modules then imported SharedModule
 *
 * Gen 2 · v14–v18: standalone was opt-in, so you wrote the flag yourself:
 *     @Component({ standalone: true, selector: 'aegis-tenant-badge', imports: [], template: `…` })
 *
 * Gen 3 · v19+ (you, on v22): standalone is the default, so the flag disappears. v22 also makes
 *     OnPush the default change detection (see M09). Same decorator, less ceremony.
 */

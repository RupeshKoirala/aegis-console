import { Component, Input } from '@angular/core';
import { Role } from '../../../shared/domain/models';

// Gen 1: not standalone → must be declared in exactly one NgModule (here: SharedModule).
@Component({
  selector: 'aegis-role-badge',
  standalone: false,
  template: `<span class="role" [class]="role">{{ role.replace('_', ' ') }}</span>`,
  styles: `.role { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; border: 1px solid; } .ADMIN { color: #f472b6; } .ANALYST { color: #60a5fa; } .READ_ONLY { color: var(--muted); }`,
})
export class RoleBadgeComponent {
  @Input({ required: true }) role!: Role;
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialsPipe } from './initials.pipe';
import { RoleBadgeComponent } from './role-badge.component';

@NgModule({
  declarations: [RoleBadgeComponent, InitialsPipe],
  imports: [CommonModule],
  exports: [RoleBadgeComponent, InitialsPipe],
})
export class SharedModule {}

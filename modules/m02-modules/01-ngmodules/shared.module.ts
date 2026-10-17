import { NgModule } from '@angular/core';
//@@sol
import { CommonModule } from '@angular/common';
import { InitialsPipe } from './initials.pipe';
import { RoleBadgeComponent } from './role-badge.component';

@NgModule({
  declarations: [RoleBadgeComponent, InitialsPipe],
  imports: [CommonModule],
  exports: [RoleBadgeComponent, InitialsPipe],
})
//@@stub
// TODO 1: declarations: [RoleBadgeComponent, InitialsPipe]
//         imports:      [CommonModule]          (Gen 1 habit: every module imports it so *ngIf/*ngFor/pipes work)
//         exports:      [RoleBadgeComponent, InitialsPipe]   (otherwise nobody outside can use them!)
@NgModule({})
//@@end
export class SharedModule {}

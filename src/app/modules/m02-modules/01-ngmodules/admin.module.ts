import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { UserTableComponent } from './user-table.component';

@NgModule({
  declarations: [UserTableComponent],
  imports: [SharedModule],
  exports: [UserTableComponent],
})
export class AdminModule {}

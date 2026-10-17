import { NgModule } from '@angular/core';
//@@sol
import { SharedModule } from './shared.module';
import { UserTableComponent } from './user-table.component';

@NgModule({
  declarations: [UserTableComponent],
  imports: [SharedModule],
  exports: [UserTableComponent],
})
//@@stub
// TODO 2: declarations: [UserTableComponent]
//         imports:      [SharedModule]
//         exports:      [UserTableComponent]   (so the standalone page can use <aegis-user-table>)
@NgModule({})
//@@end
export class AdminModule {}

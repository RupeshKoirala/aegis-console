import { Component, inject } from '@angular/core';
import { CurrentUser } from './current-user';
//@@sol
import { HasRole } from './has-role.directive';
//@@end
import { LISTS } from '../../../shared/domain/sample-data';
import { Role } from '../../../shared/domain/models';

@Component({
  selector: 'app-m06-03',
//@@sol
  imports: [HasRole],
//@@stub
  imports: [], // TODO 6a: HasRole
//@@end
  template: `
    <h1>Lists <small class="muted">as {{ user.role() }}</small></h1>
    <div class="row roles">
      @for (r of roles; track r) {
        <button class="role" [class.on]="user.role() === r" (click)="user.role.set(r)">{{ r }}</button>
      }
    </div>
    <table class="card">
      @for (l of lists; track l.id) {
        <tr class="list-row">
          <td>{{ l.name }}</td>
          <td class="actions">
<!--@@sol-->
            <span class="edit" *aegisHasRole="['ADMIN', 'ANALYST']; let role">✏️ edit as {{ role }}</span>
            <button class="delete danger" *aegisHasRole="'ADMIN'; else readOnly">Delete</button>
<!--@@stub-->
            <!-- TODO 6b:
              <span class="edit" *aegisHasRole="['ADMIN', 'ANALYST']; let role">✏️ edit as {{ role }}</span>
              <button class="delete danger" *aegisHasRole="'ADMIN'; else readOnly">Delete</button> -->
<!--@@end-->
          </td>
        </tr>
      }
    </table>
    <ng-template #readOnly><span class="locked muted">🔒</span></ng-template>
  `,
  styles: `table.card { padding: 0; } td { padding: 10px 14px; } .actions { display: flex; gap: 10px; justify-content: flex-end; align-items: center; } .role.on { background: var(--accent); color: #fff; } .roles { margin-bottom: 12px; }`,
})
export class Page {
  protected readonly user = inject(CurrentUser);
  protected readonly lists = LISTS;
  protected readonly roles: Role[] = ['ADMIN', 'ANALYST', 'READ_ONLY'];
}

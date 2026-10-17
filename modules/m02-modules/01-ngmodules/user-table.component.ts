import { Component } from '@angular/core';
import { USERS } from './users';

@Component({
  selector: 'aegis-user-table',
  standalone: false,
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css',
})
export class UserTableComponent {
  users = USERS;
}

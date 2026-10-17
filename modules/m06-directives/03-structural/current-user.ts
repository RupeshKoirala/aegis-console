import { Injectable, signal } from '@angular/core';
import { Role } from '../../../shared/domain/models';

/** Stand-in for the auth service you'll build in M15. */
@Injectable({ providedIn: 'root' })
export class CurrentUser {
  readonly role = signal<Role>('ANALYST');
}

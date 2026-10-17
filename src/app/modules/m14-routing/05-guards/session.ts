// Done for you: a stand-in for the real auth session you build in M15.
import { Injectable, signal } from '@angular/core';
import { Role } from '../../../shared/domain/models';

@Injectable({ providedIn: 'root' })
export class DemoSession {
  readonly role = signal<Role>('ANALYST');
  readonly flags = signal<Record<string, boolean>>({ threatMap: false });
}

/** Wraps window.confirm so tests (and later a nice modal) can replace it. */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  ask(message: string): boolean | Promise<boolean> {
    return window.confirm(message);
  }
}

import { Role } from '../../../shared/domain/models';

export interface AdminUser { id: number; email: string; displayName: string; role: Role; }

export const USERS: AdminUser[] = [
  { id: 1, email: 'admin@acme.test', displayName: 'Ada Admin', role: 'ADMIN' },
  { id: 2, email: 'analyst@acme.test', displayName: 'Ana Analyst', role: 'ANALYST' },
  { id: 3, email: 'viewer@acme.test', displayName: 'Vic Viewer', role: 'READ_ONLY' },
];

export interface Report { id: number; title: string; blocked: number; change: number | null; }

export const REPORTS: Report[] = [
  { id: 1, title: 'Blocked connections (7 days)', blocked: 8423.4, change: 12.5 },
  { id: 2, title: 'Blocked DNS lookups (7 days)', blocked: 2210, change: -4.25 },
  { id: 3, title: 'New threat indicators', blocked: 311, change: null },
];

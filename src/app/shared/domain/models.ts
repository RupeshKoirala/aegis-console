// Aegis domain types. They mirror the /api/v1 contract (api/openapi.yaml) field by field.
// Done for you; read it once so the names in the exercises make sense.

export type Role = 'ADMIN' | 'ANALYST' | 'READ_ONLY';
export type ListKind = 'ALLOW' | 'BLOCK' | 'THREAT';
export type IndicatorType = 'IP' | 'CIDR' | 'DOMAIN';
export type Decision = 'ALLOW' | 'BLOCK' | 'NONE';
export type Reason = 'ALLOW_LIST' | 'BLOCK_LIST' | 'THREAT_SCORE' | 'BELOW_THRESHOLD' | 'NO_MATCH';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Me {
  id: number;
  email: string;
  displayName: string;
  role: Role;
  tenantId: number;
  tenantName: string;
}

export interface TenantView {
  id: number;
  name: string;
  slug: string;
  /** set when this tenant is managed by an MSP parent tenant */
  parentId: number | null;
  createdAt: string;
}

export interface ListView {
  id: number;
  name: string;
  kind: ListKind;
  description: string | null;
  indicatorCount: number;
  createdAt: string;
}

export interface IndicatorView {
  id: number;
  listId: number;
  /** "203.0.113.7", "198.51.100.0/24" or "evil.example" */
  value: string;
  type: IndicatorType;
  /** threat lists only, e.g. "Botnets" */
  category: string | null;
  /** threat lists only, 1–100 */
  score: number | null;
  description: string | null;
  /** ISO instant, null = never expires */
  expiresAt: string | null;
  source: string;
  createdAt: string;
}

export interface CreateIndicatorRequest {
  value: string;
  category?: string | null;
  score?: number | null;
  description?: string | null;
  expiresAt?: string | null;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface VerdictMatch {
  listId: number;
  listName: string;
  kind: ListKind;
  value: string;
  category: string | null;
  score: number | null;
}

export interface VerdictView {
  query: string;
  type: IndicatorType;
  verdict: Decision;
  reason: Reason;
  threshold: number;
  matches: VerdictMatch[];
  engine: string;
}

export interface TrafficEvent {
  id: number;
  tenantId: number;
  at: string;
  source: string;
  destination: string;
  indicatorId: number;
  action: 'ALLOW' | 'BLOCK';
  severity: Severity;
  enforcementPoint: string;
}

export interface Alert {
  id: number;
  tenantId: number;
  eventId: number;
  at: string;
  severity: Severity;
  title: string;
  status: 'NEW' | 'TRIAGED' | 'RESOLVED';
  assignee: string | null;
}

/** Every API error is RFC 9457 problem+json. */
export interface Problem {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: Record<string, string>;
}

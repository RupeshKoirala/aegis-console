import { ListKind } from '../../../shared/domain/models';
import { schema } from '@angular/forms/signals';

export interface NewIndicator {
  listKind: ListKind;
  value: string;
  category: string;
  score: number | null;
  description: string;
}

export const EMPTY: NewIndicator = { listKind: 'BLOCK', value: '', category: '', score: null, description: '' };

/**
 * The rules from M13.02, written as ONE schema function. Messages are part of the rule now.
 *  TODO 1: value is required ("Required") and must classify() ({ kind: 'indicator', message: 'Not an IPv4, CIDR or domain' })
 *  TODO 2: description max 200 characters
 *  TODO 3: only when listKind is 'THREAT': category required, score required + min 1 + max 100.
 *          Otherwise category and score are HIDDEN (hidden fields don't validate and the UI doesn't render them).
 */
export const indicatorSchema = schema<NewIndicator>(p => {
});

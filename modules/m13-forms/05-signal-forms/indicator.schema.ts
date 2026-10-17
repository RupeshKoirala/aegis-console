import { ListKind } from '../../../shared/domain/models';
//@@sol
import { applyWhen, hidden, max, maxLength, min, required, schema, validate } from '@angular/forms/signals';
import { classify } from '../indicator-format';
//@@stub
import { schema } from '@angular/forms/signals';
//@@end

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
//@@sol
  required(p.value, { message: 'Required' });
  validate(p.value, ({ value }) =>
    value() && !classify(value()) ? { kind: 'indicator', message: 'Not an IPv4, CIDR or domain' } : undefined);
  maxLength(p.description, 200);
  applyWhen(p, ({ value }) => value().listKind === 'THREAT', t => {
    required(t.category, { message: 'Pick a category' });
    required(t.score, { message: 'Score 1–100' });
    min(t.score, 1);
    max(t.score, 100);
  });
  hidden(p.category, ({ valueOf }) => valueOf(p.listKind) !== 'THREAT');
  hidden(p.score, ({ valueOf }) => valueOf(p.listKind) !== 'THREAT');
//@@stub
//@@end
});

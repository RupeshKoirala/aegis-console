import { Decision, IndicatorView, ListView, Reason, VerdictMatch } from '../../../shared/domain/models';

// 🐞 4 bugs live in this file. The tests describe the correct behaviour.

const ipToInt = (ip: string) => ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;

export function covers(indicator: Pick<IndicatorView, 'type' | 'value'>, query: string, queryType: 'IP' | 'DOMAIN'): boolean {
  if (queryType === 'DOMAIN') {
    if (indicator.type !== 'DOMAIN') return false;
    return query.endsWith(indicator.value);
  }
  if (indicator.type === 'IP') return indicator.value === query;
  if (indicator.type === 'CIDR') {
    const [network, bitsText] = indicator.value.split('/');
    const bits = Number(bitsText);
    const mask = (~0 << bits) >>> 0;
    return ((ipToInt(query) & mask) >>> 0) === ((ipToInt(network) & mask) >>> 0);
  }
  return false;
}

export interface Verdict { verdict: Decision; reason: Reason; matches: VerdictMatch[]; }

export function decide(query: string, indicators: IndicatorView[], lists: ListView[], threshold: number): Verdict {
  const q = query.trim().toLowerCase();
  const type = /^[\d.]+$/.test(q) ? 'IP' : 'DOMAIN';
  const listById = new Map(lists.map(l => [l.id, l]));
  const matches: VerdictMatch[] = indicators
    .filter(i => covers(i, q, type))
    .map(i => {
      const l = listById.get(i.listId)!;
      return { listId: l.id, listName: l.name, kind: l.kind, value: i.value, category: i.category, score: i.score };
    });
  const has = (kind: string) => matches.some(m => m.kind === kind);

  if (has('BLOCK')) return { verdict: 'BLOCK', reason: 'BLOCK_LIST', matches };
  if (has('ALLOW')) return { verdict: 'ALLOW', reason: 'ALLOW_LIST', matches };
  if (matches.some(m => m.kind === 'THREAT' && (m.score ?? 0) > threshold)) return { verdict: 'BLOCK', reason: 'THREAT_SCORE', matches };
  if (has('THREAT')) return { verdict: 'NONE', reason: 'BELOW_THRESHOLD', matches };
  return { verdict: 'NONE', reason: 'NO_MATCH', matches };
}

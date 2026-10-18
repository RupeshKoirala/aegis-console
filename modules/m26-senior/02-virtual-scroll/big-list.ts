import { IndicatorView } from '../../../shared/domain/models';

/** Done for you: 100,000 fake threat-feed indicators (deterministic, so tests can rely on them). */
export function generateIndicators(count: number): IndicatorView[] {
  const cats = ['Botnets', 'Phishing', 'Scanners', 'Spam Sources', 'TOR Proxy', 'Malware Sites'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1, listId: 99,
    value: `10.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`,
    type: 'IP' as const, category: cats[i % cats.length], score: (i * 37) % 100 + 1,
    description: null, expiresAt: null, source: 'bulk-feed', createdAt: '2026-10-01T00:00:00Z',
  }));
}

export interface SearchIndex { rows: IndicatorView[]; haystack: string[] }

/**
 * TODO 1: filtering 100k rows on every keystroke must be cheap. Precompute ONCE a lower-cased "haystack" string per row
 * (`${value} ${category}`.toLowerCase()), so each search is a single .includes() per row with no allocations.
 */
export function buildIndex(rows: IndicatorView[]): SearchIndex {
//@@sol
  return { rows, haystack: rows.map(r => `${r.value} ${r.category ?? ''}`.toLowerCase()) };
//@@stub
  return { rows, haystack: [] };
//@@end
}

/** TODO 2: rows whose haystack contains the (trimmed, lower-cased) query, AND whose score ≥ minScore. Empty query = all. */
export function search(index: SearchIndex, query: string, minScore = 0): IndicatorView[] {
//@@sol
  const q = query.trim().toLowerCase();
  const out: IndicatorView[] = [];
  for (let i = 0; i < index.rows.length; i++) {
    if ((index.rows[i].score ?? 0) >= minScore && (!q || index.haystack[i].includes(q))) out.push(index.rows[i]);
  }
  return out;
//@@stub
  return index.rows.filter(r => r.value.includes(query) && (r.score ?? 0) >= minScore);
//@@end
}

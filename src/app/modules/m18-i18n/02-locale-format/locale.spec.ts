import { formatCount, formatInZone, registerAegisLocales, relativeTime, sortNames } from './locale-format';

const clean = (s: string) => s.replace(/[  ]/g, ' ');

describe('M18.02 · locale formatting', () => {
  beforeAll(() => {
    try { registerAegisLocales(); } catch { /* the stub registers nothing */ }
  });

  it('TODO 1 + 2: counts use the locale\'s grouping', () => {
    expect(formatCount(12345, 'en-US')).toBe('12,345');
    expect(clean(formatCount(12345, 'fr'))).toBe('12 345');
    expect(formatCount(12345, 'de')).toBe('12.345');
  });

  it('TODO 3: timestamps in the analyst\'s zone, labelled', () => {
    expect(formatInZone('2026-10-15T11:40:00Z', 'en-US', '+0545')).toBe('2026-10-15 17:25 (UTC+05:45)');
    expect(formatInZone('2026-10-15T02:00:00Z', 'fr', '-0400')).toBe('2026-10-14 22:00 (UTC-04:00)');
  });

  it('TODO 4: relative time in words', () => {
    const now = new Date('2026-10-15T12:00:00Z');
    expect(relativeTime('2026-10-15T11:57:00Z', now, 'en-US')).toBe('3 minutes ago');
    expect(relativeTime('2026-10-15T09:00:00Z', now, 'en-US')).toBe('3 hours ago');
    expect(relativeTime('2026-10-14T12:00:00Z', now, 'en-US')).toBe('yesterday');
    expect(clean(relativeTime('2026-10-15T11:57:00Z', now, 'fr'))).toBe('il y a 3 minutes');
    expect(relativeTime('2026-10-15T11:59:50Z', now, 'de')).toBe('vor 10 Sekunden');
  });

  it('TODO 5: human sorting', () => {
    expect(sortNames(['feed 10', 'Émergence', 'feed 2', 'abuse.ch', 'emerging'], 'fr'))
      .toEqual(['abuse.ch', 'Émergence', 'emerging', 'feed 2', 'feed 10']);
  });
});

import { classify, groupBy, isExpired, label, riskLevel } from './indicator-utils';
import { INDICATORS } from '../../../shared/domain/sample-data';

describe('M00.01 · typed domain helpers', () => {
  it('TODO 1: classify() recognises IPs, CIDRs and domains', () => {
    expect(classify('203.0.113.7')).toBe('IP');
    expect(classify('  198.51.100.0/24 ')).toBe('CIDR');
    expect(classify('EVIL.example')).toBe('DOMAIN');
    expect(classify('www.login-micr0soft.example')).toBe('DOMAIN');
    for (const bad of ['', '256.1.1.1', '1.2.3', '10.0.0.0/33', '10.0.0.0/', '10.0.0.0/8/1', 'not a domain', 'localhost']) {
      expect(classify(bad), `"${bad}" should be null`).toBeNull();
    }
  });

  it('TODO 2: riskLevel() maps scores to severities', () => {
    expect(riskLevel(null)).toBe('INFO');
    expect(riskLevel(97)).toBe('CRITICAL');
    expect(riskLevel(90)).toBe('CRITICAL');
    expect(riskLevel(75)).toBe('HIGH');
    expect(riskLevel(55)).toBe('MEDIUM');
    expect(riskLevel(10)).toBe('LOW');
  });

  it('TODO 3: isExpired() only for a past expiresAt', () => {
    const now = new Date('2026-10-30T00:00:00Z');
    expect(isExpired({ expiresAt: null }, now)).toBe(false);
    expect(isExpired({ expiresAt: '2026-10-22T12:00:00Z' }, now)).toBe(true);
    expect(isExpired({ expiresAt: '2027-01-01T00:00:00Z' }, now)).toBe(false);
  });

  it('TODO 4: groupBy() groups without mutating the input', () => {
    const copy = [...INDICATORS];
    const g = groupBy(INDICATORS, i => i.type);
    expect(Object.keys(g).sort()).toEqual(['CIDR', 'DOMAIN', 'IP']);
    expect(g['CIDR'].map(i => i.value)).toEqual(['198.51.100.0/24', '198.18.0.0/15', '192.0.2.128/25']);
    expect(INDICATORS).toEqual(copy);
    expect(groupBy([1, 2, 3, 4], n => (n % 2 ? 'odd' : 'even'))).toEqual({ odd: [1, 3], even: [2, 4] });
  });

  it('TODO 5: label() formats threat and plain indicators', () => {
    expect(label(INDICATORS.find(i => i.value === '203.0.113.66')!)).toBe('203.0.113.66 (IP) · Botnets 97');
    expect(label(INDICATORS.find(i => i.value === 'evil.example')!)).toBe('evil.example (DOMAIN)');
  });
});

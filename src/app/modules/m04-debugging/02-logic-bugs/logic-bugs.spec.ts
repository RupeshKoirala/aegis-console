import { covers, decide } from './verdict-engine';
import { INDICATORS, LISTS } from '../../../shared/domain/sample-data';
import { IndicatorView } from '../../../shared/domain/models';

const verdict = (q: string, threshold = 90) => {
  const v = decide(q, INDICATORS, LISTS, threshold);
  return `${v.verdict}/${v.reason}`;
};

describe('M04.02 · verdict engine', () => {
  it('a domain covers itself and subdomains, never look-alikes', () => {
    const evil = { type: 'DOMAIN', value: 'evil.example' } as IndicatorView;
    expect(covers(evil, 'evil.example', 'DOMAIN')).toBe(true);
    expect(covers(evil, 'www.evil.example', 'DOMAIN')).toBe(true);
    expect(covers(evil, 'notevil.example', 'DOMAIN')).toBe(false);
  });

  it('a CIDR covers exactly its prefix', () => {
    const net = { type: 'CIDR', value: '198.51.100.0/24' } as IndicatorView;
    expect(covers(net, '198.51.100.20', 'IP')).toBe(true);
    expect(covers(net, '198.51.101.20', 'IP')).toBe(false);
    const wide = { type: 'CIDR', value: '198.18.0.0/15' } as IndicatorView;
    expect(covers(wide, '198.19.255.1', 'IP')).toBe(true);
    expect(covers(wide, '198.20.0.1', 'IP')).toBe(false);
  });

  it('allow beats block', () => {
    const lists = [{ ...LISTS[0] }, { ...LISTS[1] }];
    const inds = [
      { ...INDICATORS[0], listId: 1, value: '203.0.113.7' },
      { ...INDICATORS[2], listId: 2, value: '203.0.113.7' },
    ];
    expect(decide('203.0.113.7', inds, lists, 90).verdict).toBe('ALLOW');
  });

  it('applies the rules end to end on the sample data', () => {
    expect(verdict('192.0.2.10')).toBe('ALLOW/ALLOW_LIST');
    expect(verdict('198.51.100.20')).toBe('BLOCK/BLOCK_LIST');
    expect(verdict('203.0.113.66')).toBe('BLOCK/THREAT_SCORE');
    expect(verdict('www.evil.example')).toBe('BLOCK/BLOCK_LIST');
    expect(verdict('notevil.example')).toBe('NONE/NO_MATCH');
    expect(verdict('8.8.8.8')).toBe('NONE/NO_MATCH');
  });

  it('the threshold is inclusive', () => {
    expect(verdict('203.0.113.66', 97)).toBe('BLOCK/THREAT_SCORE');
    expect(verdict('203.0.113.66', 98)).toBe('NONE/BELOW_THRESHOLD');
  });
});

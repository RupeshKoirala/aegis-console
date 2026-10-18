import { Project, checkBoundaries, hasCycle } from './boundaries';

const P: Project[] = [
  { name: 'console', type: 'app', domain: 'shared' },
  { name: 'feature-lists', type: 'feature', domain: 'lists' },
  { name: 'feature-alerts', type: 'feature', domain: 'alerts' },
  { name: 'data-access-lists', type: 'data-access', domain: 'lists' },
  { name: 'data-access-alerts', type: 'data-access', domain: 'alerts' },
  { name: 'ui-badges', type: 'ui', domain: 'shared' },
  { name: 'util-net', type: 'util', domain: 'shared' },
];

describe('M25.01 · architecture boundaries', () => {
  it('TODO 1: a clean graph has no violations', () => {
    expect(checkBoundaries(P, [
      { from: 'console', to: 'feature-lists' }, { from: 'console', to: 'feature-alerts' },
      { from: 'feature-lists', to: 'data-access-lists' }, { from: 'feature-lists', to: 'ui-badges' },
      { from: 'ui-badges', to: 'util-net' }, { from: 'data-access-lists', to: 'util-net' },
    ])).toEqual([]);
  });

  it('TODO 1: layer, domain and unknown violations', () => {
    expect(checkBoundaries(P, [
      { from: 'ui-badges', to: 'data-access-lists' },
      { from: 'feature-lists', to: 'data-access-alerts' },
      { from: 'feature-lists', to: 'feature-alerts' },
      { from: 'util-net', to: 'ui-badges' },
      { from: 'feature-lists', to: 'lodash-clone' },
    ])).toEqual([
      { from: 'ui-badges', to: 'data-access-lists', rule: 'layer' },
      { from: 'feature-lists', to: 'data-access-alerts', rule: 'domain' },
      { from: 'feature-lists', to: 'feature-alerts', rule: 'layer' },
      { from: 'util-net', to: 'ui-badges', rule: 'layer' },
      { from: 'feature-lists', to: 'lodash-clone', rule: 'unknown' },
    ]);
  });

  it('TODO 2: cycles', () => {
    expect(hasCycle([{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }])).toBe(false);
    expect(hasCycle([{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'a' }])).toBe(true);
    expect(hasCycle([{ from: 'x', to: 'x' }])).toBe(true);
    expect(hasCycle([{ from: 'a', to: 'b' }, { from: 'a', to: 'c' }, { from: 'b', to: 'c' }])).toBe(false);
  });
});

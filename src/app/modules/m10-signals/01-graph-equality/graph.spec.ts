import { TestBed } from '@angular/core/testing';
import { Page, runs } from './page';

describe('M10.01 · graph & equality', () => {
  beforeEach(() => { runs.filtered = 0; runs.ids = 0; runs.topScore = 0; });

  it('TODO 1: filtered depends on query and kind', () => {
    const c = TestBed.createComponent(Page).componentInstance;
    c.kind.set('THREAT');
    expect(c.ids().length).toBe(11);
    c.query.set('203.0.113');
    expect(c.ids().length).toBe(5);
  });

  it('TODO 3: topScore', () => {
    const c = TestBed.createComponent(Page).componentInstance;
    expect(c.topScore()).toBe(99);
    c.kind.set('ALLOW');
    expect(c.topScore()).toBe(0);
    c.query.set('nothing-matches');
    expect(c.topScore()).toBeNull();
  });

  it('computeds are lazy: nothing runs until read', () => {
    const c = TestBed.createComponent(Page).componentInstance;
    c.query.set('203');
    c.query.set('203.0');
    expect(runs.filtered).toBe(0);
    c.ids();
    expect(runs.filtered).toBe(1);
  });

  it('TODO 2: equal ids stop the ripple (topScore does not recompute)', () => {
    const c = TestBed.createComponent(Page).componentInstance;
    c.topScore();
    const before = runs.topScore;
    c.query.set(' ');            // trimmed → same filter result, new array
    c.topScore();
    expect(runs.ids).toBe(2);
    expect(runs.topScore, 'topScore recomputed although ids were equal').toBe(before);
  });
});

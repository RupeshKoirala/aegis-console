import { TestBed } from '@angular/core/testing';
import { Page } from './page';

describe('M10.02 · linkedSignal', () => {
  it('TODO 1: selection defaults to the first item and resets when the list changes', () => {
    const c = TestBed.createComponent(Page).componentInstance;
    expect(c.selected()?.value).toBe('192.0.2.10');
    c.listId.set(2);
    expect(c.selected()?.value).toBe('203.0.113.7');
  });

  it('TODO 1: it is writable, and survives a re-filter that keeps it visible', () => {
    const c = TestBed.createComponent(Page).componentInstance;
    c.listId.set(3);
    const pick = c.visible()[2];
    c.selected.set(pick);
    c.query.set('203.0.113');
    expect(c.selected()?.id).toBe(pick.id);
    c.query.set('crypto');
    expect(c.selected()?.value).toBe('crypto-miner.example');
    c.query.set('zzz');
    expect(c.selected()).toBeNull();
  });

  it('TODO 2: page resets on list or query change but stays writable', () => {
    const c = TestBed.createComponent(Page).componentInstance;
    c.page.set(3);
    expect(c.page()).toBe(3);
    c.query.set('1');
    expect(c.page()).toBe(0);
    c.page.set(2);
    c.listId.set(3);
    expect(c.page()).toBe(0);
  });
});

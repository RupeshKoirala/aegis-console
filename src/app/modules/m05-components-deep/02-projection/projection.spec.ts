import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Page } from './page';

describe('M05.02 · projection', () => {
  let f: ComponentFixture<Page>;
  let el: HTMLElement;
  const q = (s: string) => el.querySelector(s);
  beforeEach(async () => {
    f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 1: title and body land in their slots', () => {
    expect(q('.p-blocked .panel-head h3')?.textContent).toBe('Blocked connections');
    expect(q('.p-blocked .panel-body .body-text')?.textContent).toContain('1,284');
    expect(q('.p-blocked .panel-body h3'), 'title must not land in the body').toBeNull();
  });

  it('TODO 2: the footer slot, with fallback when nothing is passed', () => {
    expect(q('.p-blocked .panel-foot [panelFooter]')).not.toBeNull();
    expect(q('.p-blocked .panel-foot .fallback')).toBeNull();
    expect(q('.p-feeds .panel-foot .fallback')?.textContent).toContain('Last updated');
  });

  it('TODO 3: contentChildren counts nested actions', () => {
    expect(q('.p-blocked .action-count')?.textContent).toContain('2 actions');
    expect(q('.p-feeds .action-count')).toBeNull();
  });

  it('TODO 4: the Gen 1 panel counts with @ContentChildren', () => {
    expect(q('aegis-legacy-panel .legacy-count')?.textContent).toContain('2 actions');
  });

  it('TODO 5: ngProjectAs routes the link into the footer', () => {
    expect(q('.p-incident .panel-foot .report-link')).not.toBeNull();
    expect(q('.p-incident .panel-foot .fallback')).toBeNull();
  });
});

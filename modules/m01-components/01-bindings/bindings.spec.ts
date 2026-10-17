import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Page } from './page';
import { INDICATORS } from '../../../shared/domain/sample-data';

describe('M01.01 · bindings', () => {
  let f: ComponentFixture<Page>;
  let el: HTMLElement;
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => el.querySelector(s) as T;
  const goTo = async (value: string) => {
    for (let i = 0; i < INDICATORS.length && $('.value').textContent?.trim() !== value; i++) {
      $('button.next').click();
      await f.whenStable();
    }
  };

  beforeEach(async () => {
    f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 1–2: state lives in signals and indicator is computed from index', () => {
    const c = f.componentInstance as any;
    expect(c.copied()).toBe(false);
    c.index.set(3);
    expect(c.indicator().value).toBe(INDICATORS[3].value);
  });

  it('TODO 6: interpolates the current indicator', () => {
    expect($('.value').textContent?.trim()).toBe('192.0.2.10');
    expect($('.meta').textContent).toContain('IP · source manual');
    expect($('.counter').textContent?.replace(/\s+/g, ' ')).toContain(`1 / ${INDICATORS.length}`);
    expect($('.score').textContent).toContain('Score —');
  });

  it('TODO 3a + 9: next/prev buttons move through the list and wrap around', async () => {
    $('button.next').click();
    await f.whenStable();
    expect($('.value').textContent?.trim()).toBe('partner.example');
    $('button.prev').click();
    $('button.prev').click();
    await f.whenStable();
    expect($('.value').textContent?.trim()).toBe(INDICATORS.at(-1)!.value);
  });

  it('TODO 5: arrow keys on the card navigate', async () => {
    $('article.inspector').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await f.whenStable();
    expect($('.value').textContent?.trim()).toBe('partner.example');
  });

  it('TODO 4 + 7: attribute, class and property bindings follow the indicator', async () => {
    const card = $('article.inspector');
    expect(card.getAttribute('data-kind')).toBe('ALLOW');
    expect([...$('.pill').classList].sort()).toEqual(['ALLOW', 'pill']);
    expect($('h2.value').title).toBe('Payroll provider');
    expect($<HTMLButtonElement>('button.delete').disabled).toBe(true);
    await goTo('malware-cdn.example');
    expect(card.getAttribute('data-kind')).toBe('BLOCK');
    expect(card.classList).toContain('expired');
    expect($('h2.value').title).toBe('No description');
  });

  it('TODO 8: the score bar width is the score in percent', async () => {
    await goTo('203.0.113.66');
    expect($('.fill').style.width).toBe('97%');
    expect($('.score').textContent).toContain('Score 97');
  });

  it('TODO 3b + 9: copy sets the copied state and has an aria-label', async () => {
    const btn = $('button.copy');
    expect(btn.getAttribute('aria-label')).toBe('Copy 192.0.2.10');
    btn.click();
    await f.whenStable();
    expect(btn.textContent).toContain('✓ Copied');
    $('button.next').click();
    await f.whenStable();
    expect(btn.textContent).not.toContain('Copied');
  });
});

import { TestBed } from '@angular/core/testing';
import { Page } from './page';

async function setup() {
  const fixture = TestBed.createComponent(Page);
  fixture.autoDetectChanges();
  await fixture.whenStable();
  const el: HTMLElement = fixture.nativeElement;
  const q = <T extends Element>(s: string) => el.querySelector(s) as T;
  const settle = async () => { await fixture.whenStable(); await fixture.whenStable(); };
  const type = async (sel: string, v: string) => {
    const i = q<HTMLInputElement>(sel);
    i.value = v; i.dispatchEvent(new Event('input')); i.dispatchEvent(new Event('blur'));
    await settle();
  };
  return { fixture, el, q, type, settle, cmp: fixture.componentInstance };
}

describe('M13.01 · template-driven form', () => {
  it('TODO 1–2: the form is a real ngForm with ngModel bound to the signals', async () => {
    const { q, type, cmp } = await setup();
    expect(q('form')).toBeTruthy();
    await type('input[name=value]', 'evil.example');
    expect(cmp.value()).toBe('evil.example');
    cmp.description.set('C2');
    await new Promise(r => setTimeout(r));
    expect(q<HTMLTextAreaElement>('textarea[name=description]').value).toBe('C2');
  });

  it('TODO 3: errors appear only after the field is touched', async () => {
    const { q, type, el } = await setup();
    expect(el.querySelector('.value-error')).toBeNull();
    await type('input[name=value]', 'not an ip!');
    expect(q('.value-error').textContent).toContain('Must be an IPv4');
    await type('input[name=value]', '');
    expect(q('.value-error').textContent).toContain('Required');
    await type('input[name=value]', '198.51.100.0/24');
    expect(el.querySelector('.value-error')).toBeNull();
  });

  it('TODO 4: counter and disabled submit', async () => {
    const { q, type } = await setup();
    await type('input[name=value]', '');   // OnPush: the view refreshes on the first event (see Senior notes)
    expect(q<HTMLButtonElement>('button[type=submit]').disabled).toBe(true);
    await type('input[name=value]', '203.0.113.7');
    expect(q<HTMLButtonElement>('button[type=submit]').disabled).toBe(false);
    await type('textarea[name=description]', 'phish');
    expect(q('.count').textContent).toContain('5/200');
  });

  it('TODO 5: submit queues the request and resets the form', async () => {
    const { q, type, settle, cmp, el } = await setup();
    await type('input[name=value]', 'Evil.Example');
    q<HTMLInputElement>('input[name=notifySoc]').click();
    await settle();
    q<HTMLFormElement>('form').dispatchEvent(new Event('submit'));
    await settle();
    expect(cmp.added()).toEqual([{ value: 'evil.example', description: '', notifySoc: false }]);
    expect(cmp.value()).toBe('');
    expect(cmp.notifySoc()).toBe(true);
    expect(el.querySelector('.value-error')).toBeNull();
  });
});

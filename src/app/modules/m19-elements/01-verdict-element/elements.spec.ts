import { Injector } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { TAG, defineVerdictElement } from './define';

const tick = () => new Promise(r => setTimeout(r, 20));

describe('M19.01 · Angular Elements', () => {
  // A custom element keeps the injector it was defined with FOREVER, so give it one that lives as long as the page:
  // a standalone application, exactly like a real embed bundle would.
  beforeAll(async () => {
    const app = await createApplication();
    defineVerdictElement(app.injector);
  });
  afterEach(() => document.body.querySelectorAll(TAG).forEach(e => e.remove()));

  it('TODO 1: defines the tag once, safely', () => {
    expect(customElements.get(TAG)).toBeTruthy();
    TestBed.configureTestingModule({});
    expect(defineVerdictElement(TestBed.inject(Injector))).toBe(false);
  });

  it('TODO 1: attributes become inputs (in its shadow DOM)', async () => {
    const el = document.createElement(TAG);
    el.setAttribute('value', '203.0.113.66');
    el.setAttribute('verdict', 'BLOCK');
    document.body.appendChild(el);
    await tick();
    const pill = el.shadowRoot?.querySelector('.pill');
    expect(pill?.classList).toContain('block');
    expect(pill?.textContent).toContain('203.0.113.66');
    el.setAttribute('verdict', 'ALLOW');
    await tick();
    expect(el.shadowRoot?.querySelector('.pill')?.classList).toContain('allow');
  });

  it('TODO 1: properties work too, and outputs become CustomEvents', async () => {
    const el = document.createElement(TAG) as HTMLElement & { value: string; verdict: string };
    document.body.appendChild(el);
    el.value = 'evil.example';
    el.verdict = 'BLOCK';
    await tick();
    let detail: unknown;
    el.addEventListener('details', e => (detail = (e as CustomEvent).detail));
    (el.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
    expect(detail).toEqual({ value: 'evil.example', verdict: 'BLOCK' });
  });
});

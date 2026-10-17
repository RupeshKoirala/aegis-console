import { TestBed } from '@angular/core/testing';
import { IndicatorCard } from './indicator-card';
import { LegacyIndicatorCard } from './legacy-indicator-card';
import { Page } from './page';
import { INDICATORS } from '../../../shared/domain/sample-data';

const inputsOf = (cls: unknown) => Object.keys((cls as any).ɵcmp.inputs);
const hostOf = (value: string) => INDICATORS.find(i => i.value === value)!;

describe('M01.03 · inputs', () => {
  describe('IndicatorCard (Gen 3)', () => {
    it('TODO 1–3: declares indicator, kind (alias), compact and maxDescription inputs', () => {
      expect(inputsOf(IndicatorCard)).toEqual(expect.arrayContaining(['indicator', 'kind', 'compact', 'maxDescription']));
      expect(inputsOf(IndicatorCard), 'listKind must be exposed as "kind"').not.toContain('listKind');
    });

    it('TODO 1–2: renders what the parent passes', async () => {
      const f = TestBed.createComponent(IndicatorCard);
      f.componentRef.setInput('indicator', hostOf('203.0.113.66'));
      f.componentRef.setInput('kind', 'THREAT');
      await f.whenStable();
      expect(f.nativeElement.querySelector('.value').textContent).toContain('203.0.113.66');
      expect(f.nativeElement.querySelector('.ind-card').getAttribute('data-kind')).toBe('THREAT');
      expect(f.nativeElement.querySelector('.score').textContent).toContain('Botnets');
    });

    it('TODO 3: transforms turn attribute strings into boolean / number', async () => {
      const f = TestBed.createComponent(IndicatorCard);
      f.componentRef.setInput('indicator', hostOf('203.0.113.66'));
      f.componentRef.setInput('kind', 'THREAT');
      f.componentRef.setInput('compact', '');
      f.componentRef.setInput('maxDescription', '10');
      await f.whenStable();
      const c = f.componentInstance as any;
      expect(c.compact()).toBe(true);
      expect(c.maxDescription()).toBe(10);
      expect(f.nativeElement.querySelector('.score')).toBeNull();
    });

    it('TODO 4: shortDescription cuts with … only when needed, and reacts to input changes', async () => {
      const f = TestBed.createComponent(IndicatorCard);
      const c = f.componentInstance as any;
      f.componentRef.setInput('indicator', hostOf('198.51.100.0/24')); // "Hosting range used in incident #42" (34 chars)
      f.componentRef.setInput('kind', 'BLOCK');
      f.componentRef.setInput('maxDescription', 7);
      expect(c.shortDescription()).toBe('Hosting…');
      f.componentRef.setInput('maxDescription', 100);
      expect(c.shortDescription()).toBe('Hosting range used in incident #42');
      f.componentRef.setInput('indicator', hostOf('evil.example'));
      expect(c.shortDescription()).toBeNull();
    });
  });

  describe('LegacyIndicatorCard (Gen 1)', () => {
    it('TODO 5: declares @Input()s including the "kind" alias', () => {
      expect(inputsOf(LegacyIndicatorCard)).toEqual(expect.arrayContaining(['indicator', 'kind', 'compact', 'maxDescription']));
    });

    it('TODO 6–7: ngOnChanges keeps shortDescription in sync', async () => {
      const f = TestBed.createComponent(LegacyIndicatorCard);
      f.componentRef.setInput('indicator', hostOf('198.51.100.0/24'));
      f.componentRef.setInput('kind', 'BLOCK');
      f.componentRef.setInput('maxDescription', '7');
      await f.whenStable();
      expect(f.nativeElement.querySelector('.desc')?.textContent).toBe('Hosting…');
      f.componentRef.setInput('indicator', hostOf('203.0.113.7'));
      await f.whenStable();
      expect(f.nativeElement.querySelector('.desc')?.textContent).toBe('Phishin…');
    });
  });

  describe('Page (TODO 8–9)', () => {
    it('renders both card families with the right options', async () => {
      const f = TestBed.createComponent(Page);
      await f.whenStable();
      const el: HTMLElement = f.nativeElement;
      const withDesc = INDICATORS.filter(i => i.description).length;
      expect(el.querySelectorAll('.signal-cards aegis-indicator-card').length).toBe(withDesc + 4 + 1);
      expect(el.querySelectorAll('.legacy-cards aegis-legacy-indicator-card').length).toBe(withDesc);
      expect(el.querySelector('.compact-one .ind-card')?.classList).toContain('compact');
      expect(el.querySelector('.signal-cards .desc')?.textContent).toBe('Payroll provider');
      expect(el.querySelectorAll('.signal-cards .desc')[2]?.textContent).toBe('Hosting range used in in…');
    });
  });
});

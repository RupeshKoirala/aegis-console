import { TestBed } from '@angular/core/testing';
import { DefangPipe } from './defang.pipe';
import { CidrSizePipe } from './cidr-size.pipe';
import { RelativeTimePipe } from './relative-time.pipe';
import { Page } from './page';

describe('M07.02 · custom pipes', () => {
  it('TODO 1: defang', () => {
    const p = new DefangPipe();
    expect(p.transform('203.0.113.7')).toBe('203[.]0[.]113[.]7');
    expect(p.transform('https://login-micr0soft.example/x.php')).toBe('hxxps://login-micr0soft[.]example/x[.]php');
    expect(p.transform('HTTP://a.b')).toBe('hxxp://a[.]b');
    expect(p.transform(null)).toBe('');
  });

  it('TODO 2: cidrSize', () => {
    const p = new CidrSizePipe();
    expect(p.transform('198.51.100.0/24')).toBe(256);
    expect(p.transform('198.51.100.0/24', 'hosts')).toBe(254);
    expect(p.transform('192.0.2.128/25', 'hosts')).toBe(126);
    expect(p.transform('203.0.113.7')).toBe(1);
    expect(p.transform('203.0.113.7', 'hosts')).toBe(1);
    expect(p.transform('10.0.0.0/31', 'hosts')).toBe(2);
  });

  it('TODO 3: relativeTime', () => {
    const p = new RelativeTimePipe();
    const now = '2026-10-15T12:00:00Z';
    expect(p.transform('2026-10-15T11:59:30Z', now)).toBe('just now');
    expect(p.transform('2026-10-15T11:40:00Z', now)).toBe('20 min ago');
    expect(p.transform('2026-10-15T08:44:00Z', now)).toBe('3 h ago');
    expect(p.transform('2026-10-13T11:00:00Z', now)).toBe('2 d ago');
  });

  it('TODO 4: the page chains the pipes', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    const cidr = Array.from(el.querySelectorAll('tr.ind-row')).find(r => r.textContent?.includes('198[.]51[.]100[.]0/24'))!;
    expect(cidr.querySelector('.size')?.textContent).toBe('256');
    expect(cidr.querySelector('.hosts')?.textContent).toBe('254');
    expect(el.querySelector('.alert-row .when')?.textContent).toBe('20 min ago');
    expect(el.querySelector('.alert-row')?.textContent).toContain('203[.]0[.]113[.]66');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THIS FILE IS YOURS: replace every it.todo with a real test.  npx ng test --include src/app/modules/m22-testing/01-write-tests
// One of your tests should FAIL against the current code: that's the planted bug. Then fix it in ../indicator-table.ts.
// ─────────────────────────────────────────────────────────────────────────────
import { TestBed } from '@angular/core/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { IndicatorTable } from '../indicator-table';
import { INDICATORS } from '../../../shared/domain/sample-data';

const ROWS = INDICATORS.filter(i => i.listId === 3);

//@@sol
function render(canDelete = false) {
  const clipboard = { copy: vi.fn(() => true) };
  TestBed.configureTestingModule({ providers: [{ provide: Clipboard, useValue: clipboard }] });
  const f = TestBed.createComponent(IndicatorTable);
  f.componentRef.setInput('rows', ROWS);
  f.componentRef.setInput('canDelete', canDelete);
  f.detectChanges();
  const el: HTMLElement = f.nativeElement;
  const values = () => [...el.querySelectorAll('.row .value')].map(e => e.textContent);
  const type = (q: string) => {
    const i = el.querySelector('input.filter') as HTMLInputElement;
    i.value = q;
    i.dispatchEvent(new Event('input'));
    f.detectChanges();
  };
  return { f, el, values, type, clipboard };
}

describe('mine · IndicatorTable', () => {
  it('renders one row per indicator, sorted by value', () => {
    const { values } = render();
    expect(values().length).toBe(ROWS.length);
    expect(values()).toEqual([...ROWS.map(r => r.value)].sort());
  });

  it('filters case-insensitively', () => {
    const { values, type } = render();
    type('CRYPTO');
    expect(values()).toEqual(['crypto-miner.example']);
    type('nothing-like-this');
    expect(values()).toEqual([]);
  });

  it('sorts by score, toggling direction', () => {
    const { el, values, f } = render();
    const scoreHeader = el.querySelector('button.sort[data-col=score]') as HTMLButtonElement;
    scoreHeader.click(); f.detectChanges();
    expect(values()[0]).toBe('203.0.113.250');
    scoreHeader.click(); f.detectChanges();
    expect(values()[0]).toBe('crypto-miner.example');
    expect(scoreHeader.textContent).toContain('▼');
  });

  it('only shows remove buttons when allowed, and emits the id', () => {
    expect(render(false).el.querySelectorAll('button.remove').length).toBe(0);
    TestBed.resetTestingModule();
    const { f, el } = render(true);
    const emitted: number[] = [];
    f.componentInstance.remove.subscribe(id => emitted.push(id));
    (el.querySelector('.row[data-id="7"] button.remove') as HTMLButtonElement).click();
    expect(emitted).toEqual([7]);
  });

  it('copies through the (mocked) clipboard', () => {
    const { el, f, clipboard } = render();
    (el.querySelector('button.copy') as HTMLButtonElement).click();
    f.detectChanges();
    expect(clipboard.copy).toHaveBeenCalledWith('192.0.2.200');
    expect(el.querySelector('.copied')?.textContent).toContain('Copied 192.0.2.200');
  });
});
//@@stub
// TODO 1: a render() helper: configure a MOCK Clipboard ({ provide: Clipboard, useValue: { copy: vi.fn(() => true) } }),
//         create the component, setInput('rows', ROWS) and setInput('canDelete', …), detectChanges, return handy queries.
describe('mine · IndicatorTable', () => {
  it.todo('renders one row per indicator, sorted by value');
  // TODO 2: type "CRYPTO" into input.filter (set .value, dispatch 'input', detectChanges) → only crypto-miner.example.
  //         This is the one that finds the bug.
  it.todo('filters case-insensitively');
  // TODO 3: click the score header: lowest score first (203.0.113.250, score 55); click again: highest first + "▼"
  it.todo('sorts by score, toggling direction');
  // TODO 4: no remove buttons when canDelete is false; with true, clicking the row data-id="7" emits 7
  it.todo('only shows remove buttons when allowed, and emits the id');
  // TODO 5: clicking copy calls the mock with the value and shows "Copied …"
  it.todo('copies through the (mocked) clipboard');
});
//@@end

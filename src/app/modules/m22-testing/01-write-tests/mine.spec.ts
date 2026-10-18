// ─────────────────────────────────────────────────────────────────────────────
// THIS FILE IS YOURS: replace every it.todo with a real test.  npx ng test --include src/app/modules/m22-testing/01-write-tests
// One of your tests should FAIL against the current code: that's the planted bug. Then fix it in ../indicator-table.ts.
// ─────────────────────────────────────────────────────────────────────────────
import { TestBed } from '@angular/core/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { IndicatorTable } from '../indicator-table';
import { INDICATORS } from '../../../shared/domain/sample-data';

const ROWS = INDICATORS.filter(i => i.listId === 3);

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

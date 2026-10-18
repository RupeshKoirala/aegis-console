// The course's check that the planted bug is fixed (TODO 6). Your tests are in mine.spec.ts.
import { TestBed } from '@angular/core/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { IndicatorTable } from '../indicator-table';
import { INDICATORS } from '../../../shared/domain/sample-data';

describe('M22.01 · check', () => {
  it('TODO 6: the filter is case-insensitive', () => {
    TestBed.configureTestingModule({ providers: [{ provide: Clipboard, useValue: { copy: () => true } }] });
    const f = TestBed.createComponent(IndicatorTable);
    f.componentRef.setInput('rows', INDICATORS);
    f.componentInstance.query.set('EVIL');
    expect(f.componentInstance.view().map(r => r.value)).toEqual(['evil.example']);
  });
});

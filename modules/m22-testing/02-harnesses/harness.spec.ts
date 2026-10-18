import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { IndicatorTableHarness } from './indicator-table.harness';
import { Page } from './page';

// These tests are written ONLY against the harness: no CSS selectors, no fixture.nativeElement.
describe('M22.02 · IndicatorTableHarness', () => {
  let loader: HarnessLoader;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: Clipboard, useValue: { copy: () => true } }] });
    const f = TestBed.createComponent(Page);
    loader = TestbedHarnessEnvironment.loader(f);
  });

  it('TODO 1 + 2: reads, filters and sorts', async () => {
    const [blocks] = await loader.getAllHarnesses(IndicatorTableHarness);
    expect(await blocks.getValues()).toEqual(['198.51.100.0/24', '203.0.113.7', 'evil.example', 'malware-cdn.example']);
    await blocks.filter('EXAMPLE');
    expect(await blocks.getValues()).toEqual(['evil.example', 'malware-cdn.example']);
    await blocks.filter('zzz');
    expect(await blocks.isEmpty()).toBe(true);
    await blocks.filter('');
    await blocks.sortBy('value');
    expect((await blocks.getValues())[0]).toBe('malware-cdn.example');
  });

  it('TODO 2: removal goes through the harness', async () => {
    const [blocks, threats] = await loader.getAllHarnesses(IndicatorTableHarness);
    expect(await blocks.canRemove()).toBe(true);
    expect(await threats.canRemove()).toBe(false);
    await blocks.remove('evil.example');
    expect(await blocks.getValues()).not.toContain('evil.example');
    expect((await blocks.getValues()).length).toBe(3);
  });

  it('TODO 3: find a specific table with a predicate', async () => {
    const threats = await loader.getHarness(IndicatorTableHarness.with({ containsValue: 'crypto-miner.example' }));
    expect(await threats.canRemove()).toBe(false);
    expect(await loader.hasHarness(IndicatorTableHarness.with({ containsValue: 'nope.example' }))).toBe(false);
  });
});

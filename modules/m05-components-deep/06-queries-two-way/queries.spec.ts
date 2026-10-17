import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Page } from './page';
import { TagInput } from './tag-input';
import { LegacyTagInput } from './legacy-tag-input';

describe('M05.06 · view queries & two-way binding', () => {
  let f: ComponentFixture<Page>;
  let el: HTMLElement;
  const entry = () => el.querySelector<HTMLInputElement>('aegis-tag-input .entry')!;
  const type = async (v: string) => {
    entry().value = v;
    entry().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await f.whenStable();
  };
  beforeEach(async () => {
    f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 1: tags is a model (two-way)', () => {
    expect(Object.keys((TagInput as any).ɵcmp.outputs)).toContain('tagsChange');
  });

  it('TODO 2–3: adds via Enter, de-duplicates, clears the input, counts chips via viewChildren', async () => {
    await type('  Phishing ');
    await type('phishing');
    await type('incident-42');
    expect(el.querySelector('.parent-view')?.textContent).toContain('botnet, phishing, incident-42');
    expect(entry().value).toBe('');
    expect(el.querySelector('aegis-tag-input .count')?.textContent).toContain('3 tags');
  });

  it('TODO 3b: removing a chip updates the parent; parent reset flows back down', async () => {
    (el.querySelector('aegis-tag-input .x') as HTMLElement).click();
    await f.whenStable();
    expect(f.componentInstance.labels()).toEqual([]);
    f.componentInstance.labels.set(['a', 'b']);
    await f.whenStable();
    expect(el.querySelectorAll('aegis-tag-input .chip').length).toBe(2);
  });

  it('TODO 4 + 6: the parent focuses the child input through a component query', async () => {
    (el.querySelector('button.focus') as HTMLElement).click();
    expect(document.activeElement).toBe(entry());
  });

  it('TODO 5: Gen 1 @Input/@Output pair supports [(tags)]', async () => {
    expect(Object.keys((LegacyTagInput as any).ɵcmp.outputs)).toContain('tagsChange');
    (el.querySelector('.add-urgent') as HTMLElement).click();
    await f.whenStable();
    expect(f.componentInstance.legacyLabels).toEqual(['scanner', 'urgent']);
  });
});

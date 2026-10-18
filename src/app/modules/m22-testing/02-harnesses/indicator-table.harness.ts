import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SortKey } from '../indicator-table';

export interface IndicatorTableHarnessFilters extends BaseHarnessFilters {
  /** only tables that currently show a row with this value */
  containsValue?: string;
}

/**
 * A HARNESS is a page object for one component: tests talk to it ("filter by evil", "remove 203.0.113.7")
 * instead of CSS selectors. When the template changes, you fix the harness once, not 40 tests.
 * Everything is async (it also drives Playwright/Protractor environments, where every call is a round-trip).
 */
export class IndicatorTableHarness extends ComponentHarness {
  static hostSelector = 'aegis-indicator-table';

  // TODO 1: locators (lazy finders, scoped to this component):
  //   this.locatorFor('input.filter'), this.locatorForAll('.row .value'), this.locatorForOptional('…')
  // TODO 2: the API the tests use. Each returns a Promise:
  //   getValues(): string[]       the text of every .row .value, in order
  //   filter(text)                clear the input, then sendKeys(text) (if not empty)
  //   sortBy('value' | 'score')   click button.sort[data-col="…"]
  //   canRemove(): boolean        is there any button.remove?
  //   remove(value)               click the remove button of the row showing that value (rows carry data-id)
  //   isEmpty(): boolean          is the .empty row shown?
  // TODO 3: static with({ containsValue }) → new HarnessPredicate(IndicatorTableHarness, options)
  //           .addOption('containsValue', options.containsValue, async (h, v) => (await h.getValues()).includes(v))
  static with(options: IndicatorTableHarnessFilters = {}): HarnessPredicate<IndicatorTableHarness> {
    return new HarnessPredicate(IndicatorTableHarness, options);
  }
  async getValues(): Promise<string[]> { return []; }
  async filter(_text: string): Promise<void> {}
  async sortBy(_key: SortKey): Promise<void> {}
  async canRemove(): Promise<boolean> { return false; }
  async remove(_value: string): Promise<void> {}
  async isEmpty(): Promise<boolean> { return false; }
}

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

  private readonly filterInput = this.locatorFor('input.filter');
  private readonly valueCells = this.locatorForAll('.row .value');
  private readonly sortButton = (key: SortKey) => this.locatorFor(`button.sort[data-col="${key}"]`)();

  static with(options: IndicatorTableHarnessFilters = {}): HarnessPredicate<IndicatorTableHarness> {
    return new HarnessPredicate(IndicatorTableHarness, options).addOption('containsValue', options.containsValue, async (h, value) =>
      (await h.getValues()).includes(value),
    );
  }

  async getValues(): Promise<string[]> {
    return Promise.all((await this.valueCells()).map(c => c.text()));
  }

  async filter(text: string): Promise<void> {
    const input = await this.filterInput();
    await input.clear();
    if (text) await input.sendKeys(text);
  }

  async sortBy(key: SortKey): Promise<void> {
    await (await this.sortButton(key)).click();
  }

  async canRemove(): Promise<boolean> {
    return (await this.locatorForOptional('button.remove')()) !== null;
  }

  async remove(value: string): Promise<void> {
    for (const row of await this.locatorForAll('.row')()) {
      const id = await row.getAttribute('data-id');
      const cell = await this.locatorFor(`.row[data-id="${id}"] .value`)();
      if ((await cell.text()) === value) return (await this.locatorFor(`.row[data-id="${id}"] button.remove`)()).click();
    }
    throw new Error(`No row with value ${value}`);
  }

  async isEmpty(): Promise<boolean> {
    return (await this.locatorForOptional('.empty')()) !== null;
  }
}

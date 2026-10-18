# M22.02 · Component harnesses  ⏱ 50 min

Forty tests that do `el.querySelector('.row .value')` all break the day someone renames a class. A **harness** is the component's *test API*, written once next to the component:

```ts
export class IndicatorTableHarness extends ComponentHarness {
  static hostSelector = 'aegis-indicator-table';
  private readonly filterInput = this.locatorFor('input.filter');
  async filter(text: string) { const i = await this.filterInput(); await i.clear(); await i.sendKeys(text); }
}
// in any test:
const table = await TestbedHarnessEnvironment.loader(fixture).getHarness(IndicatorTableHarness.with({ containsValue: 'evil.example' }));
await table.filter('example');
```
Angular Material ships a harness for every component (`MatButtonHarness`, `MatSelectHarness`…), which is the reason teams using Material write `await select.open()` instead of hunting overlay panels in the DOM.

## Your tasks: `indicator-table.harness.ts` TODO 1–3
The spec only talks to the harness. Read it first: it's the API you're building.

## Senior notes
- Harness methods are **async** because the same harness runs in TestBed *and* in browser e2e environments (Protractor before, Playwright/WebDriver adapters now), where each call crosses a process boundary.
- `sendKeys`, `click` and `blur` trigger change detection and wait for stability for you, with no manual `detectChanges()`.
- Publish harnesses from shared UI libraries (M25): consumers test against your components without knowing their DOM.
- Gen 1: page objects written by hand per e2e suite. Gen 2/3: CDK harnesses (v9+), the same API for unit and e2e.

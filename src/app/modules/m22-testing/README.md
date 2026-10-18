# M22 · Testing

📖 **Read first (Study Hub):** `angular-manual/m17` testing, tooling & conventions · `foundations/l14` testing

You've *run* ~300 specs in this course. Now you **write** them, at three levels of the testing pyramid:

| # | Exercise | You practise |
|---|---|---|
| 01 | Write the tests yourself | TestBed, `setInput`, DOM interaction, outputs, mocking a dependency, finding a planted bug, mutation checking |
| 02 | Component harnesses | `ComponentHarness`, locators, `HarnessPredicate`, `TestbedHarnessEnvironment` |
| 03 | End-to-end with Playwright | user-facing locators, auto-waiting assertions, data isolation, `webServer`, traces |

### Generations
- **Gen 1:** Karma + Jasmine, Protractor for e2e, `async`/`fakeAsync` + zone.js.
- **Gen 2:** Jest/Cypress/Playwright by choice, CDK harnesses, `HttpTestingController`.
- **Gen 3 (v21–v22):** Vitest is the default unit runner, zoneless TestBed (`whenStable`), Playwright is the common e2e choice.

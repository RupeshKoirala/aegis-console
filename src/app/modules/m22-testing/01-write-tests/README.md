# M22.01 · Write the tests yourself  ⏱ 60 min

Until now the specs were given. On the job, **you** write them, and a reviewer will ask "where are the tests?" on every PR. `IndicatorTable` (in `../indicator-table.ts`) filters, sorts, copies to the clipboard and emits removals. It has **one bug**.

The test toolbox you've seen throughout the course:
```ts
TestBed.configureTestingModule({ providers: [{ provide: Clipboard, useValue: { copy: vi.fn(() => true) } }] });  // mock a dependency
const f = TestBed.createComponent(IndicatorTable);
f.componentRef.setInput('rows', ROWS);          // inputs, the way a parent template sets them
f.detectChanges();                              // render
input.value = 'x'; input.dispatchEvent(new Event('input'));   // act like a user
f.componentInstance.remove.subscribe(...)       // outputs
expect(mock.copy).toHaveBeenCalledWith('…')     // interactions with dependencies
```

## Your tasks
1. `mine.spec.ts`: replace each `it.todo` (TODO 1–5).
2. One test goes red. Find out why, and fix `indicator-table.ts` (TODO 6). `check.spec.ts` turns green.
3. **Mutation check:** break the code on purpose (remove the `canDelete` check, reverse the sort) and make sure one of *your* tests fails each time.

## Senior notes
- **Test behaviour through the DOM and public API**, not private fields: then refactors don't break tests, and a passing test means a working feature.
- Mock at the **boundary** (clipboard, HTTP, time), not the component's own logic. Over-mocking produces tests that pass while the app is broken.
- One reason per test. Name tests after the behaviour ("filters case-insensitively"), so a failure reads like a bug report.
- Coverage numbers are a smell detector, not a goal: `npx ng test --coverage` shows what *no* test touches.
- **Gen 1/2:** Karma + Jasmine (`jasmine.createSpyObj`, `fakeAsync/tick`, `ComponentFixture.debugElement.query(By.css)`). **Gen 3 (v21+):** Vitest is the CLI default (`vi.fn`, `vi.useFakeTimers`), zoneless fixtures (`await fixture.whenStable()`).

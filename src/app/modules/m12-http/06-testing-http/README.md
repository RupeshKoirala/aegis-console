# M12.06 · Testing HTTP code: you write the tests  ⏱ 45 min

So far the tests were written for you. Now **you** write them. `verdict-api.ts` is finished, and `verdict-api.spec.ts` has failing placeholders. Replace each `expect.fail(...)` with a real test.

```ts
TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
const http = TestBed.inject(HttpTestingController);

api.check('203.0.113.66').subscribe(v => (result = v));
const req = http.expectOne(r => r.url === '/api/v1/verdict');   // assert a request was made…
expect(req.request.params.get('q')).toBe('203.0.113.66');      // …with the right shape
req.flush(fakeVerdict);                                          // answer it
expect(result).toEqual(…);
http.verify();                                                   // no unexpected requests left over
```
Error responses: `req.flush(problemBody, { status: 400, statusText: 'Bad Request' })`. Network failures: `req.error(new ProgressEvent('error'))`.

## Your task: implement the 5 tests in `verdict-api.spec.ts`
Each placeholder states what to prove. A good test fails when the behaviour breaks, so try breaking `verdict-api.ts` on purpose and check that your test turns red.

## Senior notes
- Test **behaviour at the boundary** (URL, params, body, how errors are mapped), not implementation details.
- `http.verify()` in `afterEach` catches accidental duplicate requests, a common source of double-billing bugs.

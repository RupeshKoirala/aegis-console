# M02.02 · Migrate a module to standalone  ⏱ 35 min

The **reports** area below works. It's built the Gen 1 way: two non-standalone components in a `ReportsModule`. Your job is the migration every team at a company like yours is doing right now.

## The 3 steps (the same ones the official migration runs)
1. **Convert declarations:** remove `standalone: false`, and add to each component's own `imports` exactly what its template uses.
2. **Remove unnecessary modules:** once nothing is declared in `ReportsModule`, delete it, and have consumers import the components directly.
3. **Switch bootstrapping:** done app-wide in `main.ts`. Compare the two versions:
```ts
// Gen 1 main.ts
platformBrowserDynamic().bootstrapModule(AppModule);        // AppModule: declarations, imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)]
// Gen 3 main.ts + app.config.ts
bootstrapApplication(App, { providers: [provideRouter(routes), provideHttpClient()] });
```
Automated: `ng generate @angular/core:standalone` (it asks which step to run). In practice you run it, then fix the remaining imports by hand. That's this exercise.

## Your tasks
- `report-card.component.ts`: TODO 1 · `reports-list.component.ts`: TODO 2 · `reports.module.ts`: TODO 3 · `page.ts`: TODO 4

## Check
`npm run ex -- m02/02`. The page must look exactly the same before and after. A migration should change no behaviour: the test "behaviour is unchanged" is already green when you start, and it must **stay** green.

## Senior notes
- Migrate **leaf** components first (those that use no other custom components), then work upwards.
- Keep NgModules that exist for **providers** (`SomeLibModule.forRoot()`) until the library offers `provideSomething()` functions.
- When you're done, `ng build` with no `NG8001/NG8002` errors and an unchanged screenshot is your definition of done.

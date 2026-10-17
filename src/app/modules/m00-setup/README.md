# M00 · Setup, TypeScript & the compiler

📖 **Read first (Study Hub):** `js/l15` TypeScript essentials · `js/l16` TypeScript for Angular code · `angular/l7` your project's files · `angular-manual/m1` origins and the shape of Angular · `angular-manual/m2` the compiler

| # | Exercise | You practise |
|---|---|---|
| 01 | Typed domain helpers | union types, narrowing, generics, `readonly`, template literals, pure functions |
| 02 | Your first components | `@Component`, selectors, inline vs file templates, `imports`, what the compiler generates |

## Before you start: the project in 60 seconds
```
src/main.ts              bootstrapApplication(App, appConfig): the program starts here
src/app/app.config.ts    app-wide providers (router, http, …)
src/app/app.ts/.html     the root component (the training shell)
src/app/modules/…        your exercises
api/server.cjs           the fake backend (port 3000), used from M12 on
angular.json             build/serve/test configuration (the proxy lives here)
```
Commands you'll use all the time: `npm start` (app + API), `npm run ex -- m00/01` (tests for one exercise), `npx ng generate component name --dry-run` (shows what *would* be created).

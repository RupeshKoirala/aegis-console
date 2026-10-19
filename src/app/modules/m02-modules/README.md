# M02 · NgModules → standalone

📖 **Read first (Study Hub):** `angular-manual/m3` components (standalone) · `m11` dependency injection (module providers) · `m18` the whole picture

![M02 map: components, services and data flow](../../../../public/diagrams/m02.svg)

🧪 **After the exercises: [LAB.md](LAB.md)**: observe it in a debugger · break it on purpose · fix a seeded bug on a branch with one new git skill.

From 2016 to 2023, **every** Angular app was organised in `NgModule`s. Any company with an Angular product older than two years has some, often hundreds. You need to **read** them fluently, **extend** them safely and **migrate** them.

| # | Exercise | You practise |
|---|---|---|
| 01 | Build a feature with NgModules | `declarations`, `imports`, `exports`, shared modules, compilation scope |
| 02 | Migrate a module to standalone | the 3-step migration and what changes in bootstrapping |

### The three generations of "how does a component know other components?"
| Gen | Era | Answer |
|---|---|---|
| 1 | v2–v13 | It's **declared** in an NgModule. It can use whatever that module declares or imports from other modules' **exports**. App bootstrap: `platformBrowserDynamic().bootstrapModule(AppModule)`. |
| 2 | v14–v18 | Opt-in `standalone: true`. Standalone components import what they use; modules and standalone components mix freely. |
| 3 | v19+ / v22 | Standalone is the default. `bootstrapApplication(App, appConfig)` and `providers` in `app.config.ts`. NgModules remain for libraries and legacy code. |

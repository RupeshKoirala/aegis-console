# M19 · Angular Elements

📖 **Read first (Study Hub):** `angular-manual/m3` components · `foundations/l20` front-end architecture

| # | Exercise | You practise |
|---|---|---|
| 01 | Embeddable verdict badge | `createCustomElement`, `customElements.define`, attributes/properties → inputs, outputs → `CustomEvent`, Shadow DOM, `CUSTOM_ELEMENTS_SCHEMA` |

### Generations
- **Gen 1 (≤ v5):** no official support. Teams hand-wrote web-component wrappers.
- **Gen 2 (v6–v14):** `@angular/elements` with `entryComponents` and `ngDoBootstrap` in an NgModule.
- **Gen 3 (v15–v22):** standalone components + `createApplication()`, and zoneless elements with a smaller runtime.

# M06 · Directives

📖 **Read first (Study Hub):** `angular-manual/m10` directives, host bindings & pipes · `m5` control flow (what `*` desugars to)

![M06 map: components, services and data flow](../../../../public/diagrams/m06.svg)

🧪 **After the exercises: [LAB.md](LAB.md)**: observe it in a debugger · break it on purpose · fix a seeded bug on a branch with one new git skill.

A **directive** is a component without a template. It attaches behaviour to an element that already exists. Attribute directives change how an element looks or acts. Structural directives decide **whether and how often** a template is stamped into the DOM.

| # | Exercise | You practise |
|---|---|---|
| 01 | Severity highlight | `@Directive`, aliased input, `host` bindings, `ElementRef` + `Renderer2`, `effect` |
| 02 | Copy-to-clipboard | `exportAs` (`#c="aegisCopy"`), directive state in the template |
| 03 | `*aegisHasRole` | `TemplateRef`, `ViewContainerRef`, star syntax, `else` templates, `ngTemplateContextGuard` |
| 04 | Composition | `hostDirectives` with input/output forwarding |

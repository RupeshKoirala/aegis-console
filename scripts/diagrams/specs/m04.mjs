export default {
  id: 'm04',
  title: 'M04 · Debugging: where each bug hides',
  lead: 'Every bug has a layer. The compiler catches template typos, the console catches runtime crashes, and only tests and breakpoints catch wrong-but-quiet logic.',
  groups: [
    ['01 runtime bugs', 0, 0, 1, 1],
    ['02 logic bugs', 2, 0, 3, 1],
  ],
  nodes: [
    ['tsc', 'tool', 'Compiler (ng build)', 'NG8001 / NG8002 / TS2339', 0, 0],
    ['p1', 'comp', 'Page', '01-runtime-bugs/page.ts', 1, 0],
    ['lab', 'comp', 'CompileLab', 'compile-lab.ts', 1, 1],
    ['cons', 'tool', 'Console + Sources', 'TypeError, NG0100, NG0955', 0, 1],
    ['p2', 'comp', 'Page (verdict tester)', '02-logic-bugs/page.ts', 2.5, 0],
    ['eng', 'fn', 'decide() · covers()', 'verdict-engine.ts', 2, 1, { hot: true }],
    ['spec', 'tool', 'Vitest spec', 'verdict-engine.spec.ts', 3, 1],
  ],
  edges: [
    ['tsc', 'p1', 'event', 'build errors'],
    ['p1', 'lab', 'call', 'renders'],
    ['cons', 'p1', 'event', 'stack trace → line'],
    ['p2', 'eng', 'call', 'decide(query())'],
    ['spec', 'eng', 'call', 'expect(decide(…))'],
  ],
  notes: [
    'Read an error top-down: code (NG0xxx) → message → the FIRST stack frame inside src/app. Click it; source maps open your .ts file.',
    'A logic bug throws nothing. Shrink the input until the spec still fails, then step through decide() with a breakpoint.',
    'The bug branch for this module has 12 commits. git bisect finds the one that broke the threshold.',
  ],
};

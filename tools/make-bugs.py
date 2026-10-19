#!/usr/bin/env python3
"""Builds the bug/mNN-* branches: origin/solutions + seeded bugs, verified to fail the module's specs.
usage: make-bugs.py [m00 m01 ...]   (default: all in BUGS)"""
import os, subprocess, sys

REPO = '/home/user/aegis-console'
WT = '/home/user/bug-worktree'
NODE = '/home/user/.toolchain/node-v24.22.0-linux-x64/bin'
ENV = {**os.environ, 'PATH': f"{NODE}:{os.environ['PATH']}"}
G = ['git', '-c', 'user.name=Aegis Dev', '-c', 'user.email=dev@aegis.example']
M = 'src/app/modules/'

def log_line(mod, text):
    """A harmless commit: a line in the module's CHANGELOG.md."""
    return (f'{mod}/CHANGELOG.md', 'APPEND', f'- {text}\n')

# commit = (message, [(file, old, new) | (file, 'APPEND', text)])
BUGS = {
  'm00': ('bug/m00-classify', 'm00-setup', [
    ('Normalise indicator input before classification', [
      ('m00-setup/01-typed-domain/indicator-utils.ts', 'const v = value.trim().toLowerCase();', 'const v = value.trim();')]),
    ('Docs: note on supported indicator kinds', [log_line('m00-setup', 'classify() supports IPv4, CIDR, domain, URL and hashes')]),
  ]),
  'm01': ('bug/m01-watchlist', 'm01-components', [
    ('Watchlist: avoid allocating a new array on every toggle', [
      ('m01-components/06-first-service/watchlist.service.ts',
       'this.ids.update(ids => (ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]));',
       'this.ids.update(ids => {\n      if (ids.includes(id)) ids.splice(ids.indexOf(id), 1);\n      else ids.push(id);\n      return ids;\n    });')]),
    ('Changelog for the watchlist', [log_line('m01-components', 'watchlist toggling is now allocation-free')]),
  ]),
  'm02': ('bug/m02-role-badge', 'm02-modules', [
    ('RoleBadge: keep role ids consistent with the API', [
      ('m02-modules/01-ngmodules/role-badge.component.ts', "role.replace('_', ' ')", "role.replace(' ', '_')")]),
    ('Changelog', [log_line('m02-modules', 'role badge shows API role ids')]),
  ]),
  'm03': ('bug/m03-projection', 'm03-practice', [
    ('Planner: align growth with the month number', [
      ('m03-practice/01-planner-signals/projection.ts', 'Math.pow(1 + input.monthlyGrowthPct / 100, month - 1)', 'Math.pow(1 + input.monthlyGrowthPct / 100, month)')]),
    ('Changelog', [log_line('m03-practice', 'projection months are 1-based in the table')]),
  ]),
  'm04': ('bug/m04-verdicts', 'm04-debugging', [
    *[(msg, [log_line('m04-debugging', line)]) for msg, line in [
      ('Verdict tester: wording', 'clearer wording on the verdict tester'),
      ('Engine: document match order', 'documented the match order: allow, block, threat'),
      ('Tests: name the cases', 'named the verdict test cases'),
      ('Engine: comment the CIDR helper', 'commented covers() for CIDR ranges'),
      ('Page: placeholder text', 'better placeholder in the query box'),
      ('Docs: threshold explained', 'explained the score threshold in the README'),
    ]],
    ('Verdict engine: tidy the threat comparison', [
      ('m04-debugging/02-logic-bugs/verdict-engine.ts', '(m.score ?? 0) >= threshold', '(m.score ?? 0) > threshold'),
      log_line('m04-debugging', 'tidied the threat comparison')]),
    *[(msg, [log_line('m04-debugging', line)]) for msg, line in [
      ('Page: spacing', 'tightened the result spacing'),
      ('Engine: reason codes listed', 'listed every reason code'),
      ('Docs: link the lesson', 'linked the debugging lesson'),
      ('Tests: one more example', 'added an example verdict'),
      ('Changelog tidy', 'tidied this changelog'),
    ]],
  ]),
  'm05': ('bug/m05-tags', 'm05-components-deep', [
    ('TagInput: simplify add()', [
      ('m05-components-deep/06-queries-two-way/tag-input.ts', 'this.tags.update(t => [...t, tag]);', 'this.tags().push(tag);')]),
    ('Panel: changelog', [log_line('m05-components-deep', 'panel slots documented')]),
    ('Encapsulation: changelog', [log_line('m05-components-deep', 'badge styles reviewed')]),
  ]),
  'm06': ('bug/m06-has-role', 'm06-directives', [
    ('HasRole: skip a redundant clear()', [
      ('m06-directives/03-structural/has-role.directive.ts', '      this.vcr.clear();\n', '')]),
    ('Changelog', [log_line('m06-directives', 'hasRole renders less')]),
  ]),
  'm07': ('bug/m07-sort', 'm07-pipes', [
    ('Changelog', [log_line('m07-pipes', 'defang handles hxxp')]),
    ('perf(sortBy): sort in place instead of copying large lists', [
      ('m07-pipes/03-pure-impure/sort-by.pipe.ts', 'return [...items].sort(', 'return (items as T[]).sort(')]),
    ('Changelog', [log_line('m07-pipes', 'sortBy is faster on big lists')]),
  ]),
  'm08': ('bug/m08-injector', 'm08-di', [
    ('IsolatedCounter: rely on the provider above', [
      ('m08-di/01-injector-tree/isolated-counter.ts', '  providers: [CounterService],\n', '')]),
    ('Changelog', [log_line('m08-di', 'fewer providers in the tree demo')]),
  ]),
  'm09': ('bug/m09-onpush', 'm09-change-detection', [
    ('Alert demo: update the status directly', [
      ('m09-change-detection/01-onpush-mechanics/page.ts', "this.alert = { ...this.alert, status: 'RESOLVED' };", "this.alert.status = 'RESOLVED';")]),
    ('Changelog', [log_line('m09-change-detection', 'alert demo simplified')]),
  ]),
}
# Extra branches some git drills need: name -> (base bug branch, commits)
EXTRA = {
  'm08': ('bug/m08-injector-update', [
    ('Docs: injector tree notes (teammate)', [log_line('m08-di', 'teammate: added notes on element injectors')]),
  ]),
}

def run(cmd, cwd=WT, check=True, **kw):
    return subprocess.run(cmd, cwd=cwd, env=ENV, check=check, text=True, capture_output=True, **kw)

def apply(commits):
    for msg, edits in commits:
        for f, old, new in edits:
            p = os.path.join(WT, M, f)
            if old == 'APPEND':
                head = '' if os.path.exists(p) else '# Changelog\n\n'
                with open(p, 'a') as fh: fh.write(head + new)
                continue
            s = open(p).read()
            assert s.count(old) == 1, f'{f}: expected exactly one "{old[:50]}" (found {s.count(old)})'
            open(p, 'w').write(s.replace(old, new))
        run(['git', 'add', '-A']); run(G + ['commit', '-qm', msg])

def main(mods):
    run(['git', 'fetch', '-q', 'origin', 'solutions'], cwd=REPO)
    if not os.path.isdir(WT):
        run(['git', 'worktree', 'add', '-q', '--detach', WT, 'origin/solutions'], cwd=REPO)
        os.symlink(f'{REPO}/node_modules', f'{WT}/node_modules')
    for mod in mods:
        branch, folder, commits = BUGS[mod]
        run(['git', 'checkout', '-q', '-B', branch, 'origin/solutions'])
        apply(commits)
        t = run(['npx', 'ng', 'test', '--include', M + folder, '--watch=false'], check=False)
        failed = t.returncode != 0 and 'Tests' in t.stdout
        summary = [l for l in t.stdout.splitlines() if 'Tests ' in l]
        print(f'{branch}: {"FAILS as intended" if failed else "!! DOES NOT FAIL"}  {summary[-1].strip() if summary else t.stdout[-300:]}')
        if not failed: sys.exit(1)
        if os.environ.get('NOPUSH'): continue
        run(['git', 'push', '-qf', 'origin', branch])
        if mod in EXTRA:
            xb, xc = EXTRA[mod]
            run(['git', 'checkout', '-q', '-B', xb, branch]); apply(xc); run(['git', 'push', '-qf', 'origin', xb])
            print(f'{xb}: pushed')
    run(['git', 'checkout', '-q', '--detach', 'origin/solutions'])

if __name__ == '__main__':
    main(sys.argv[1:] or list(BUGS))

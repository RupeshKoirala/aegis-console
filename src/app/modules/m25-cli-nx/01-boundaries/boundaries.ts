/**
 * Large Angular workspaces (Nx, or a CLI workspace with libraries) split code into PROJECTS with tags, then a lint
 * rule forbids imports that break the architecture. Here you implement that rule as a function.
 *
 * Every project has a type and (except shared/core) a domain:
 *   type: 'app' | 'feature' | 'ui' | 'data-access' | 'util'
 *   domain: 'lists' | 'alerts' | 'auth' | 'shared'
 */
export type ProjectType = 'app' | 'feature' | 'ui' | 'data-access' | 'util';
export interface Project { name: string; type: ProjectType; domain: string }
export interface Import { from: string; to: string }
export interface Violation { from: string; to: string; rule: 'layer' | 'domain' | 'unknown' }

/** Which TYPES each type may depend on. Done for you: the layers, top to bottom. */
export const ALLOWED: Record<ProjectType, ProjectType[]> = {
  app: ['feature', 'ui', 'data-access', 'util'],
  feature: ['ui', 'data-access', 'util'],
  ui: ['ui', 'util'],
  'data-access': ['data-access', 'util'],
  util: ['util'],
};

/**
 * TODO 1: return every violation, in input order:
 *   - an import whose `from` or `to` isn't a known project              → rule 'unknown'
 *   - the target's type isn't in ALLOWED[source type]                    → rule 'layer'   (e.g. ui → data-access)
 *   - otherwise, source and target domains differ and the target's domain isn't 'shared'
 *                                                                        → rule 'domain'  (feature-lists → data-access-alerts)
 *   ('app' projects may import any domain: they compose features.)
 */
export function checkBoundaries(projects: Project[], imports: Import[]): Violation[] {
  const byName = new Map(projects.map(p => [p.name, p]));
  const out: Violation[] = [];
  for (const { from, to } of imports) {
    const a = byName.get(from);
    const b = byName.get(to);
    if (!a || !b) out.push({ from, to, rule: 'unknown' });
    else if (!ALLOWED[a.type].includes(b.type)) out.push({ from, to, rule: 'layer' });
    else if (a.type !== 'app' && a.domain !== b.domain && b.domain !== 'shared') out.push({ from, to, rule: 'domain' });
  }
  return out;
}

/** TODO 2: true if the import graph has a cycle (a → b → … → a). Depth-first search with a "visiting" set. */
export function hasCycle(imports: Import[]): boolean {
  const graph = new Map<string, string[]>();
  for (const { from, to } of imports) graph.set(from, [...(graph.get(from) ?? []), to]);
  const done = new Set<string>();
  const visiting = new Set<string>();
  const visit = (n: string): boolean => {
    if (visiting.has(n)) return true;
    if (done.has(n)) return false;
    visiting.add(n);
    const cyclic = (graph.get(n) ?? []).some(visit);
    visiting.delete(n);
    done.add(n);
    return cyclic;
  };
  return [...graph.keys()].some(visit);
}

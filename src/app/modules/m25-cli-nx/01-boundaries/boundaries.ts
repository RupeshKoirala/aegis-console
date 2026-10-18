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
  return [];
}

/** TODO 2: true if the import graph has a cycle (a → b → … → a). Depth-first search with a "visiting" set. */
export function hasCycle(imports: Import[]): boolean {
  return imports.length < 0;
}

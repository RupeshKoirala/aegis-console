export default {
  id: 'm02',
  title: 'M02 · NgModules → standalone',
  lead: 'Gen 1 apps group components into NgModules: declarations are private, exports are public. Standalone components skip the middleman and import exactly what they use.',
  groups: [
    ['01 build a feature with NgModules', 0, 0, 2, 2],
    ['02 migrate to standalone', 3, 0, 3, 2],
  ],
  nodes: [
    ['p1', 'comp', 'Page (standalone)', '01-ngmodules/page.ts', 1, 0],
    ['admin', 'module', 'AdminModule', 'admin.module.ts', 1, 1],
    ['table', 'comp', 'UserTableComponent', 'user-table.component.ts', 0, 2],
    ['shared', 'module', 'SharedModule', 'shared.module.ts', 2, 1],
    ['badge', 'comp', 'RoleBadgeComponent', 'role-badge.component.ts', 1.25, 2, { w: 180 }],
    ['pipe', 'pipe', 'InitialsPipe', 'initials.pipe.ts', 2.1, 2, { hot: true, w: 180 }],
    ['p2', 'comp', 'Page', '02-migrate…/page.ts', 3, 0],
    ['list', 'comp', 'ReportsList (standalone)', 'reports-list.component.ts', 3, 1, { w: 210 }],
    ['card', 'comp', 'ReportCard (standalone)', 'report-card.component.ts', 3, 2, { w: 210 }],
  ],
  edges: [
    ['p1', 'admin', 'di', 'imports: [AdminModule]'],
    ['admin', 'table', 'call', 'declares + exports'],
    ['admin', 'shared', 'di', 'imports'],
    ['shared', 'badge', 'call', 'exports'],
    ['shared', 'pipe', 'call', 'exports'],
    ['p2', 'list', 'di', 'imports: [ReportsList]'],
    ['list', 'card', 'di', 'imports: [ReportCard]'],
  ],
  notes: [
    'Follow a name: UserTable uses | initials. That works only because AdminModule imports SharedModule, which EXPORTS InitialsPipe. Break any link → NG8004 "No pipe found".',
    'After migration (right column) the arrows go straight from user to dependency. No module in between: that is the whole point.',
    'In Angular DevTools a component shows its standalone flag; NgModule-declared ones do not.',
  ],
};

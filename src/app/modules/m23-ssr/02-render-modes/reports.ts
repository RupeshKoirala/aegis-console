// Done for you: the published reports (the real ones come from GET /api/v1/reports, which the backend series builds).
export interface ThreatReport { slug: string; headline: string; published: string; draft: boolean }

export const REPORTS: ThreatReport[] = [
  { slug: '2026-10-botnet-wave', headline: 'Botnet C2 wave targets school networks', published: '2026-10-15', draft: false },
  { slug: '2026-09-phishing-kits', headline: 'Look-alike login pages rise 40%', published: '2026-09-30', draft: false },
  { slug: '2026-08-tor-exits', headline: 'TOR exit nodes in credential stuffing', published: '2026-08-12', draft: false },
  { slug: '2026-11-draft', headline: 'Unpublished draft', published: '', draft: true },
];

/** Pretend API call: the build calls this at PRERENDER time, not in the browser. */
export async function fetchPublishedReports(): Promise<ThreatReport[]> {
  return REPORTS.filter(r => !r.draft);
}

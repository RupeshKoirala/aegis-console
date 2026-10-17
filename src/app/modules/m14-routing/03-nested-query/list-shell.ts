import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { INDICATORS, LISTS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-list-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h2>{{ list()?.name }}</h2>
    <nav class="row tabs">
      <a routerLink="indicators" routerLinkActive="active" queryParamsHandling="preserve">Indicators</a>
      <a routerLink="about" routerLinkActive="active">About</a>
    </nav>
    <router-outlet />
  `,
  styles: `.tabs a { padding: 4px 10px; } .tabs a.active { border-bottom: 2px solid var(--accent); }`,
})
export class ListShell {
  readonly listId = input.required({ transform: numberAttribute });
  readonly list = computed(() => LISTS.find(l => l.id === this.listId()));
}

@Component({
  selector: 'app-about-tab',
  template: `<p class="about">{{ list()?.description }} · {{ list()?.kind }}</p>`,
})
export class AboutTab {
  // Done for you: a CHILD route reading its PARENT's param. Input binding only sees this route's own params
  // (unless the app sets paramsInheritanceStrategy: 'always'), so go through route.parent.
  private readonly listId = toSignal(inject(ActivatedRoute).parent!.paramMap.pipe(map(p => Number(p.get('listId')))), { initialValue: 0 });
  readonly list = computed(() => LISTS.find(l => l.id === this.listId()));
}

const orEmpty = (v: string | undefined) => v ?? '';

@Component({
  selector: 'app-indicators-tab',
  template: `
    <div class="row filters">
      <input class="q" placeholder="filter…" [value]="q()" (input)="setFilter({ q: $any($event.target).value })" />
      <select class="type" [value]="type()" (change)="setFilter({ type: $any($event.target).value })">
        <option value="">any type</option><option>IP</option><option>CIDR</option><option>DOMAIN</option>
      </select>
    </div>
    <ul class="card">@for (i of rows(); track i.id) { <li class="row"><span class="mono">{{ i.value }}</span> <span class="muted">{{ i.category }}</span></li> }
      @empty { <li class="muted empty">No match.</li> }</ul>
  `,
})
export class IndicatorsTab {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly listId = toSignal(this.route.parent!.paramMap.pipe(map(p => Number(p.get('listId')))), { initialValue: 0 });

  /** ?q=… and ?type=… arrive as inputs too. GOTCHA: an ABSENT param is bound as undefined, not your default. */
  readonly q = input('', { transform: orEmpty });
  readonly type = input('', { transform: orEmpty });

  readonly rows = computed(() => {
    const q = this.q().toLowerCase();
    return INDICATORS.filter(i => i.listId === this.listId())
      .filter(i => !this.type() || i.type === this.type())
      .filter(i => !q || i.value.includes(q) || (i.category ?? '').toLowerCase().includes(q));
  });

  /**
   * TODO 3: write the filter to the URL so it survives reload and can be shared:
   *   navigate to [] relative to this route, MERGING with the other query params,
   *   dropping empty values (null removes a param), and replacing the history entry (no back-button spam).
   */
  setFilter(change: { q?: string; type?: string }) {
    const queryParams = Object.fromEntries(Object.entries(change).map(([k, v]) => [k, v || null]));
    return this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge', replaceUrl: true });
  }
}

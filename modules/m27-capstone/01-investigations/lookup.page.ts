import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { VerdictView } from '../../../shared/domain/models';
import { classify } from '../../m13-forms/indicator-format';

const orEmpty = (v: string | undefined) => v ?? '';

@Component({
  selector: 'app-m27-lookup',
  imports: [RouterLink],
  template: `
    <form class="row card" (submit)="$event.preventDefault(); submit()">
      <input class="q mono" placeholder="IP or domain, e.g. evil.example" [value]="draft()" (input)="draft.set($any($event.target).value)" />
      <button class="primary">Check</button>
    </form>
    @if (q() && !valid()) { <p class="error-text invalid">"{{ q() }}" is not an IPv4 address or a domain.</p> }
    @if (verdict.isLoading()) { <p class="muted">Checking…</p> }
    @if (verdict.hasValue()) {
      @let v = verdict.value()!;
      <section class="card result">
        <h2 class="row"><span class="verdict badge">{{ v.verdict }}</span> <span class="mono">{{ v.query }}</span></h2>
        <p>Reason: <b class="reason">{{ v.reason }}</b> · threshold {{ v.threshold }}</p>
        <ul>@for (m of v.matches; track $index) {
          <li><a class="match" [routerLink]="['../lists', m.listId]">{{ m.listName }}</a> ({{ m.kind }}) <span class="mono">{{ m.value }}</span>
            @if (m.score) { · score {{ m.score }} }</li>
        } @empty { <li class="muted">No list mentions it.</li> }</ul>
      </section>
    }
  `,
})
export class LookupPage {
  /** ?q=… : the URL is the source of truth, so a verdict link can be pasted into a ticket. */
  readonly q = input('', { transform: orEmpty });
  readonly draft = linkedSignal(() => this.q());
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
//@@sol
  readonly valid = computed(() => ['IP', 'DOMAIN'].includes(classify(this.q()) ?? ''));
  readonly verdict = httpResource<VerdictView>(() => (this.valid() ? { url: '/api/v1/verdict', params: { q: this.q().trim() } } : undefined));

  submit() {
    this.router.navigate([], { relativeTo: this.route, queryParams: { q: this.draft().trim() || null } });
  }
//@@stub
  // TODO R4: valid: q() classifies as 'IP' or 'DOMAIN' (classify from M13). A CIDR can't get a verdict.
  //          verdict: httpResource<VerdictView> of GET /api/v1/verdict?q=<trimmed q> ONLY when valid (undefined otherwise: no request)
  //          submit(): put the trimmed draft in the URL (?q=…, relative to this route). Empty → remove the param.
  readonly valid = computed(() => !!classify(this.q()));
  readonly verdict = httpResource<VerdictView>(() => undefined);
  submit() {
  }
//@@end
}

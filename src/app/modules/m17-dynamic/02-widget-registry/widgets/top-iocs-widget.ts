import { Component, computed, input } from '@angular/core';
import { INDICATORS } from '../../../../shared/domain/sample-data';

@Component({
  selector: 'aegis-top-iocs-widget',
  template: `<div class="card widget top-iocs"><small class="muted">Top {{ limit() }} indicators</small>
    <ol>@for (i of rows(); track i.id) { <li class="mono">{{ i.value }} <small>({{ i.score }})</small></li> }</ol></div>`,
})
export default class TopIocsWidget {
  readonly limit = input(5);
  readonly rows = computed(() => INDICATORS.filter(i => i.score).sort((a, b) => b.score! - a.score!).slice(0, this.limit()));
}

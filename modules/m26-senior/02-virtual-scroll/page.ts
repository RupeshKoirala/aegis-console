import { Component, computed, signal, viewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { buildIndex, generateIndicators, search } from './big-list';

export const ROW_HEIGHT = 32;
const INDEX = buildIndex(generateIndicators(100_000));

@Component({
  selector: 'app-m26-02',
  imports: [ScrollingModule],
  template: `
    <h1>100,000 indicators <small class="muted">CDK virtual scroll</small></h1>
    <div class="row card">
      <input class="q" placeholder="filter: ip or category" [value]="query()" (input)="query.set($any($event.target).value)" />
      <label>min score <input type="number" class="min" [value]="minScore()" (input)="minScore.set(+$any($event.target).value)" /></label>
      <span class="muted count">{{ rows().length.toLocaleString() }} rows</span>
      <button class="jump" (click)="jumpTo(50_000)">Jump to #50,000</button>
    </div>
<!--@@sol-->
    <cdk-virtual-scroll-viewport class="viewport card" [itemSize]="rowHeight" minBufferPx="320" maxBufferPx="640">
      <div class="row-item" *cdkVirtualFor="let r of rows(); trackBy: byId" [style.height.px]="rowHeight">
        <span class="mono">{{ r.value }}</span> <span>{{ r.category }}</span> <b>{{ r.score }}</b>
      </div>
    </cdk-virtual-scroll-viewport>
<!--@@stub-->
    <!-- TODO 3: this renders 100,000 DOM rows: the tab freezes and uses ~1 GB. Render only what's visible:
         <cdk-virtual-scroll-viewport class="viewport card" [itemSize]="rowHeight" minBufferPx="320" maxBufferPx="640">
           <div class="row-item" *cdkVirtualFor="let r of rows(); trackBy: byId" [style.height.px]="rowHeight"> … </div>
         </cdk-virtual-scroll-viewport>
         Every row MUST be exactly rowHeight tall (fixed-size strategy). -->
    <div class="viewport card">
      @for (r of rows().slice(0, 2000); track r.id) {
        <div class="row-item" [style.height.px]="rowHeight"><span class="mono">{{ r.value }}</span> <span>{{ r.category }}</span> <b>{{ r.score }}</b></div>
      }
    </div>
<!--@@end-->
  `,
  styles: `.viewport { height: 480px; overflow: auto; padding: 0; } .row-item { display: flex; gap: 16px; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--border); box-sizing: border-box; }`,
})
export class Page {
  protected readonly rowHeight = ROW_HEIGHT;
  readonly query = signal('');
  readonly minScore = signal(0);
  readonly rows = computed(() => search(INDEX, this.query(), this.minScore()));
//@@sol
  private readonly viewport = viewChild(CdkVirtualScrollViewport);
  protected byId = (_: number, r: { id: number }) => r.id;
  jumpTo(index: number) {
    this.viewport()?.scrollToIndex(index);
  }
//@@stub
  // TODO 4: byId trackBy function, and jumpTo(index) via viewChild(CdkVirtualScrollViewport) → scrollToIndex(index)
  protected byId = (_: number, r: { id: number }) => r.id;
  jumpTo(_index: number) {}
//@@end
}

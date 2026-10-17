//@@sol
import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
//@@stub
import { Component } from '@angular/core';
//@@end
import { PanelAction } from './panel-action';

/** Gen 1: @ContentChildren + QueryList + ngAfterContentInit. */
@Component({
  selector: 'aegis-legacy-panel',
  template: `<section class="legacy"><ng-content /><p class="legacy-count muted">{{ count }} actions (Gen 1)</p></section>`,
  styles: `.legacy { border: 1px dashed var(--border); border-radius: 12px; padding: 12px; }`,
})
//@@sol
export class LegacyPanel implements AfterContentInit {
  @ContentChildren(PanelAction, { descendants: true }) actions!: QueryList<PanelAction>;
  count = 0;

  ngAfterContentInit(): void {
    this.count = this.actions.length;
  }
//@@stub
export class LegacyPanel {
  count = 0;
  // TODO 4: @ContentChildren(PanelAction, { descendants: true }) actions!: QueryList<PanelAction>;
  //         and in ngAfterContentInit() (implements AfterContentInit) set this.count = this.actions.length
  //         (the QueryList is NOT available in the constructor or ngOnInit, which is the Gen 1 gotcha)
//@@end
}

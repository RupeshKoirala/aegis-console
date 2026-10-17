import {
  AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DestroyRef, DoCheck,
  OnChanges, OnDestroy, OnInit, SimpleChanges, afterNextRender, inject, input,
} from '@angular/core';
import { LifecycleLog } from './lifecycle-log';

@Component({
  selector: 'aegis-hook-probe',
  template: `<div class="probe card">probe: <strong>{{ label() }}</strong></div>`,
})
//@@sol
export class HookProbe implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
//@@stub
// TODO 1: implement every lifecycle interface:
//   OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy
export class HookProbe {
//@@end
  readonly label = input.required<string>();
  private readonly log = inject(LifecycleLog);

  constructor() {
    this.log.log('constructor');
//@@sol
    inject(DestroyRef).onDestroy(() => this.log.log('DestroyRef'));
    afterNextRender(() => this.log.log('afterNextRender'));
//@@stub
    // TODO 3: inject(DestroyRef).onDestroy(...) → log 'DestroyRef'
    // TODO 4: afterNextRender(...) → log 'afterNextRender'
//@@end
  }
//@@sol

  ngOnChanges(changes: SimpleChanges): void {
    this.log.log(`ngOnChanges(${Object.keys(changes).join(',')})`);
  }
  ngOnInit(): void { this.log.log('ngOnInit'); }
  ngDoCheck(): void { this.log.logCheck('ngDoCheck'); }
  ngAfterContentInit(): void { this.log.log('ngAfterContentInit'); }
  ngAfterContentChecked(): void { this.log.logCheck('ngAfterContentChecked'); }
  ngAfterViewInit(): void { this.log.log('ngAfterViewInit'); }
  ngAfterViewChecked(): void { this.log.logCheck('ngAfterViewChecked'); }
  ngOnDestroy(): void { this.log.log('ngOnDestroy'); }
//@@stub

  // TODO 2: one method per hook, each logging its own name, e.g.  ngOnInit(): void { this.log.log('ngOnInit'); }
  //         ngOnChanges must log the changed input names:  `ngOnChanges(${Object.keys(changes).join(',')})`  → "ngOnChanges(label)"
  //         The three *Check hooks (ngDoCheck, ngAfterContentChecked, ngAfterViewChecked) must use this.log.logCheck(...)
  //         instead of log(...). Read lifecycle-log.ts to see why.
//@@end
}

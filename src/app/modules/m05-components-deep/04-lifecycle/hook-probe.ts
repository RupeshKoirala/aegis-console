import {
  AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DestroyRef, DoCheck,
  OnChanges, OnDestroy, OnInit, SimpleChanges, afterNextRender, inject, input,
} from '@angular/core';
import { LifecycleLog } from './lifecycle-log';

@Component({
  selector: 'aegis-hook-probe',
  template: `<div class="probe card">probe: <strong>{{ label() }}</strong></div>`,
})
export class HookProbe implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  readonly label = input.required<string>();
  private readonly log = inject(LifecycleLog);

  constructor() {
    this.log.log('constructor');
    inject(DestroyRef).onDestroy(() => this.log.log('DestroyRef'));
    afterNextRender(() => this.log.log('afterNextRender'));
  }

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
}

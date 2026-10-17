import { Component, ViewEncapsulation } from '@angular/core';

/** Ships one GLOBAL rule on purpose (prefixed so it can't collide). */
@Component({
  selector: 'aegis-global-reset',
//@@sol
  encapsulation: ViewEncapsulation.None,
//@@stub
  // TODO 5: make these styles global:  encapsulation: ViewEncapsulation.None
//@@end
  template: ``,
  styles: `.aegis-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }`,
})
export class GlobalReset {}

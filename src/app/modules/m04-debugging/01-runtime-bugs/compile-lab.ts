/* Compiler-error lab: uncomment ONE line at a time, read the error, then comment it back.

import { Component } from '@angular/core';

@Component({
  selector: 'aegis-compile-lab',
  // template: `<aegis-does-not-exist />`,                    // → NG8001
  // template: `<input [notAProperty]="1" />`,                 // → NG8002
  // template: `{{ 'x' | unknownPipe }}`,                       // → NG8004
  // template: `{{ alertz.length }}`,                           // → TS2339 (typo: alertz)
  template: `ok`,
})
export class CompileLab {
  alerts = [];
}
*/
export {};

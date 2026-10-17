import { Component } from '@angular/core';
import { markLoaded } from '../chunk-log';

markLoaded('audit-log');

@Component({
  selector: 'app-audit-log',
  template: `<h2 class="audit">Audit log</h2><ul class="card"><li class="mono">admin@acme.test INDICATOR_ADDED 203.0.113.7</li></ul>`,
})
export default class AuditLog {}

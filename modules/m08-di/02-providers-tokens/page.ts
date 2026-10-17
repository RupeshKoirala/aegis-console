import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
//@@sol
import { AEGIS_CONFIG, AUDIT_LOGGER, ConsoleLogger, FEATURE_FLAGS, Logger, flagsFor } from './tokens';
//@@stub
import { AEGIS_CONFIG, AUDIT_LOGGER, FEATURE_FLAGS, Logger } from './tokens';
//@@end

@Component({
  selector: 'app-m08-02',
  imports: [JsonPipe],
  providers: [
//@@sol
    { provide: AEGIS_CONFIG, useValue: Object.freeze({ apiBase: '/api/v1', threshold: 90, env: 'prod' }) },
    { provide: FEATURE_FLAGS, useFactory: () => flagsFor(inject(AEGIS_CONFIG).env) },
    { provide: Logger, useClass: ConsoleLogger },
    { provide: AUDIT_LOGGER, useExisting: Logger },
//@@stub
    // TODO 1: AEGIS_CONFIG → useValue: Object.freeze({ apiBase: '/api/v1', threshold: 90, env: 'prod' })
    // TODO 2: FEATURE_FLAGS → useFactory: () => flagsFor(inject(AEGIS_CONFIG).env)
    // TODO 3: Logger (the abstract class) → useClass: ConsoleLogger
    // TODO 4: AUDIT_LOGGER → useExisting: Logger   (an alias: the very same instance, not a second one)
//@@end
  ],
  template: `
    <h1>Providers & tokens</h1>
    <pre class="card config mono">{{ config | json }}</pre>
    <p class="flags">bulk import: <strong>{{ flags.bulkImport ? 'on' : 'off' }}</strong> · live stream: <strong>{{ flags.liveStream ? 'on' : 'off' }}</strong></p>
    <button class="log" (click)="audit.log('analyst opened settings')">Write audit entry</button>
    <ul class="lines">@for (l of logger.lines; track $index) { <li class="mono">{{ l }}</li> }</ul>
  `,
})
export class Page {
  protected readonly config = inject(AEGIS_CONFIG);
  protected readonly flags = inject(FEATURE_FLAGS);
  protected readonly logger = inject(Logger);
  protected readonly audit = inject(AUDIT_LOGGER);
}

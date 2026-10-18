import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderNote } from './notes';

@Component({
  selector: 'aegis-threat-note',
  template: `<div class="note" [innerHTML]="html()"></div>`,
})
export class ThreatNote {
  readonly markdown = input.required<string>();
  private readonly sanitizer = inject(DomSanitizer);
  /**
   * renderNote's output goes through Angular's sanitizer via [innerHTML], a SECOND line of defence.
   * Never bypassSecurityTrustHtml on anything derived from user input.
   */
  readonly html = computed<string | SafeHtml>(() => renderNote(this.markdown()));
}

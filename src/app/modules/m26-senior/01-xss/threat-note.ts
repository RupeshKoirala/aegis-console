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
  // TODO 4: a previous developer "fixed" Angular stripping their markup with bypassSecurityTrustHtml. That turned off the
  //         only protection left. Remove the bypass: return renderNote(...) as a plain string, and let [innerHTML] sanitize it.
  readonly html = computed<string | SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(renderNote(this.markdown())));
}

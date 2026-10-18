import { Component, input } from '@angular/core';

@Component({
  selector: 'aegis-unknown-widget',
  template: `<div class="card widget unknown error-text">Unknown widget "{{ type() }}". Check the dashboard config.</div>`,
})
export class UnknownWidget {
  readonly type = input('');
}

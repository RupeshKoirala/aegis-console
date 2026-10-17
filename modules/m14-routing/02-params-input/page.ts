import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-m14-02',
  imports: [RouterOutlet],
  template: `<h1>Lists <small class="muted">route params as inputs</small></h1><router-outlet />`,
})
export class Page {}

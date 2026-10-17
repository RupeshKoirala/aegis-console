import { Component, inject } from '@angular/core';
import { ListStore } from './list-store';

@Component({
  selector: 'app-m12-02',
  templateUrl: './page.html',
})
export class Page {
  protected readonly store = inject(ListStore);
  constructor() {
    this.store.load();
  }
}

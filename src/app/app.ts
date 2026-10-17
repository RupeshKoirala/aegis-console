import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { COMING_SOON, CURRICULUM } from './core/curriculum';

// The training shell. Done for you, and worth reading once you finish M05: it uses most of what you learn.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly modules = CURRICULUM;
  protected readonly comingSoon = COMING_SOON;
  protected readonly open = signal<string | null>(CURRICULUM.at(-1)?.id ?? null);

  toggle(id: string) {
    this.open.update(cur => (cur === id ? null : id));
  }
}

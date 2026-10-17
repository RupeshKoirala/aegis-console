import { Component, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
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
  private readonly url = toSignal(
    inject(Router).events.pipe(filter(e => e instanceof NavigationEnd), map(e => e.urlAfterRedirects)),
    { initialValue: '' },
  );
  /** The expanded module follows the URL (m14/04/lists/2 → m14), but you can still toggle by hand (M10.02). */
  protected readonly open = linkedSignal<string | null>(() => {
    const id = this.url().split('/')[1];
    return CURRICULUM.some(m => m.id === id) ? id : (CURRICULUM.at(-1)?.id ?? null);
  });

  toggle(id: string) {
    this.open.update(cur => (cur === id ? null : id));
  }
}

import { computed, signal } from '@angular/core';

export const WATCHLIST_KEY = 'aegis.watchlist';

function load(): number[] {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) ?? '[]');
  } catch {
    return [];
  }
}

// TODO 1: make this an injectable singleton:  @Injectable({ providedIn: 'root' })  (import Injectable)
export class WatchlistService {
  private readonly ids = signal<number[]>(load());

  // TODO 2: a public read-only view of the ids  →  this.ids.asReadonly()
  readonly watched = this.ids;
  // TODO 3: the number of watched ids, as a computed
  readonly count = computed(() => 0);

  // TODO 4: in a constructor, an effect() that saves ids() to localStorage under WATCHLIST_KEY (JSON)

  has(id: number): boolean {
    return false; // TODO 5a
  }

  toggle(id: number) {
    // TODO 5b: add if missing, remove if present (immutably)
  }

  clear() {
    // TODO 5c
  }
}

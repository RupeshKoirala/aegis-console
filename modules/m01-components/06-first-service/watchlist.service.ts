//@@sol
import { Injectable, computed, effect, signal } from '@angular/core';
//@@stub
import { computed, signal } from '@angular/core';
//@@end

export const WATCHLIST_KEY = 'aegis.watchlist';

function load(): number[] {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) ?? '[]');
  } catch {
    return [];
  }
}

//@@sol
@Injectable({ providedIn: 'root' })
//@@stub
// TODO 1: make this an injectable singleton:  @Injectable({ providedIn: 'root' })  (import Injectable)
//@@end
export class WatchlistService {
  private readonly ids = signal<number[]>(load());
//@@sol
  readonly watched = this.ids.asReadonly();
  readonly count = computed(() => this.ids().length);

  constructor() {
    effect(() => localStorage.setItem(WATCHLIST_KEY, JSON.stringify(this.ids())));
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number) {
    this.ids.update(ids => (ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]));
  }

  clear() {
    this.ids.set([]);
  }
//@@stub

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
//@@end
}

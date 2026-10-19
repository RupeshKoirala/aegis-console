import { Injectable, computed, effect, signal } from '@angular/core';

export const WATCHLIST_KEY = 'aegis.watchlist';

function load(): number[] {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) ?? '[]');
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly ids = signal<number[]>(load());
  readonly watched = this.ids.asReadonly();
  readonly count = computed(() => this.ids().length);

  constructor() {
    effect(() => localStorage.setItem(WATCHLIST_KEY, JSON.stringify(this.ids())));
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number) {
    this.ids.update(ids => {
      if (ids.includes(id)) ids.splice(ids.indexOf(id), 1);
      else ids.push(id);
      return ids;
    });
  }

  clear() {
    this.ids.set([]);
  }
}

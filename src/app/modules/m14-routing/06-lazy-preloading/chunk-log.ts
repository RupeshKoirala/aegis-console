// Done for you: lazy files push their name here when the browser EVALUATES them, so you can see when chunks load.
import { signal } from '@angular/core';
export const loadedChunks = signal<string[]>([]);
export const markLoaded = (name: string) => loadedChunks.update(l => (l.includes(name) ? l : [...l, name]));

import { ErrorHandler, Injectable, InjectionToken, inject } from '@angular/core';

export const RELOAD_GUARD_KEY = 'aegis.chunk-reload-at';
export const CHUNK_RELOAD = new InjectionToken<() => void>('CHUNK_RELOAD', { factory: () => () => location.reload() });

/**
 * After a deploy, an open tab still runs the OLD main bundle, which tries to lazy-load OLD chunk files
 * (m20-state-ABC123.js) that no longer exist on the server → "Failed to fetch dynamically imported module".
 *
 * TODO 3: isChunkLoadError(error): true when the message (error.message, or String(error)) matches
 *   /Failed to fetch dynamically imported module|Loading chunk [\w-]+ failed|Importing a module script failed/i
 */
export function isChunkLoadError(error: unknown): boolean {
  return error === 'TODO';
}

/**
 * TODO 4: an ErrorHandler that reloads ONCE on a chunk error (the reload fetches the new index.html → new chunk names).
 *   - not a chunk error → delegate to the default behaviour: console.error(error)
 *   - chunk error and no reload in the last 10 s (sessionStorage[RELOAD_GUARD_KEY] holds the time) → store Date.now(), reload
 *   - chunk error but we JUST reloaded → don't loop forever: console.error(error) instead
 * Register it in app.config.ts: { provide: ErrorHandler, useClass: ChunkErrorHandler }
 */
@Injectable()
export class ChunkErrorHandler implements ErrorHandler {
  private readonly reload = inject(CHUNK_RELOAD);
  handleError(error: unknown): void {
    console.error(error);
  }
}

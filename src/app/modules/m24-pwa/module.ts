import type { CourseModule } from '../../core/curriculum';
import { ErrorHandler } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { ChunkErrorHandler } from './02-offline-chunks/chunk-errors';
import { AppUpdates } from './01-updates/app-updates';

export const M24: CourseModule = {
  id: 'm24',
  title: 'PWA & service worker',
  read: ['foundations/l25', 'foundations/l30', 'angular-manual/m16'],
  exercises: [
    {
      id: '01', title: 'App updates with SwUpdate', load: () => import('./01-updates/page').then(m => m.Page),
      // Disabled in the course app (the dev server can't run a service worker); the README lab enables it.
      // AppUpdates is listed here too: a root-provided service can't see providers that only exist on this route.
      providers: [provideServiceWorker('ngsw-worker.js', { enabled: false }), AppUpdates],
    },
    {
      id: '02', title: 'Offline caching & stale chunks', load: () => import('./02-offline-chunks/page').then(m => m.Page),
      providers: [{ provide: ErrorHandler, useClass: ChunkErrorHandler }],
    },
  ],
};

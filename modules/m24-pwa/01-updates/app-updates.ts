import { DestroyRef, Injectable, InjectionToken, inject, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
//@@sol
import { filter, interval } from 'rxjs';
//@@end

/** How the page reloads. A token so tests can check it without actually reloading. */
export const RELOAD = new InjectionToken<() => void>('RELOAD', { factory: () => () => location.reload() });
export const CHECK_EVERY_MS = 6 * 60 * 60 * 1000;

/**
 * The on-call view is installed as a PWA and stays open for days. When we deploy, the service worker downloads the
 * new version in the background, but the open tab keeps running the OLD code until it reloads. This service
 * notices the update and lets the analyst switch at a safe moment (never mid-triage, without asking).
 */
@Injectable({ providedIn: 'root' })
export class AppUpdates {
  private readonly sw = inject(SwUpdate);
  private readonly reload = inject(RELOAD);
  /** set when a new version is downloaded and ready: { current, latest } version hashes */
  readonly ready = signal<{ current: string; latest: string } | null>(null);
  /** the cached app is broken (e.g. files evicted): the only fix is a reload */
  readonly broken = signal(false);

  constructor() {
//@@sol
    if (!this.sw.isEnabled) return;
    const subs = [
      this.sw.versionUpdates
        .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
        .subscribe(e => this.ready.set({ current: e.currentVersion.hash, latest: e.latestVersion.hash })),
      this.sw.unrecoverable.subscribe(() => this.broken.set(true)),
      interval(CHECK_EVERY_MS).subscribe(() => void this.sw.checkForUpdate()),
    ];
    inject(DestroyRef).onDestroy(() => subs.forEach(s => s.unsubscribe()));
//@@stub
    // TODO 1: if the service worker isn't enabled (dev server, old browser), do nothing.
    // TODO 2: versionUpdates → only 'VERSION_READY' events (filter with a type guard: e is VersionReadyEvent)
    //         → ready.set({ current: e.currentVersion.hash, latest: e.latestVersion.hash })
    // TODO 3: unrecoverable → broken.set(true)
    // TODO 4: every CHECK_EVERY_MS ask the server for a new version: interval(...) → this.sw.checkForUpdate()
    //         (Unsubscribe everything via inject(DestroyRef).onDestroy.)
//@@end
  }

  /** TODO 5: the analyst clicked "Reload now": activateUpdate() (switch this tab to the new version), THEN reload. */
  async applyUpdate(): Promise<void> {
//@@sol
    await this.sw.activateUpdate();
    this.reload();
//@@stub
//@@end
  }
}

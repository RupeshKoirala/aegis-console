import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * TODO 2: preload ONLY routes marked data: { preload: true }, and never on a "save data" connection
 * (navigator.connection?.saveData; it's undefined in many browsers, so treat that as false).
 * preload() returns load() to fetch the chunk now, or of(null) to skip.
 */
@Injectable({ providedIn: 'root' })
export class OptInPreloading implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
//@@sol
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    return route.data?.['preload'] && !saveData ? load() : of(null);
//@@stub
    return load();
//@@end
  }
}

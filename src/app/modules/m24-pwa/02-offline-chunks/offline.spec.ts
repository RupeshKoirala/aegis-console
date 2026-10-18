import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NGSW_CONFIG } from './ngsw-config';
import { CHUNK_RELOAD, ChunkErrorHandler, RELOAD_GUARD_KEY, isChunkLoadError } from './chunk-errors';

describe('M24.02 · offline config', () => {
  it('TODO 1: the app shell is prefetched, assets lazy', () => {
    const [app, assets] = NGSW_CONFIG.assetGroups;
    expect(app).toMatchObject({ name: 'app', installMode: 'prefetch' });
    expect(app.resources.files).toEqual(expect.arrayContaining(['/index.html', '/*.js', '/*.css']));
    expect(assets).toMatchObject({ name: 'assets', installMode: 'lazy', updateMode: 'prefetch' });
  });

  it('TODO 2: lists/verdicts are network-first, reports cache-first, auth never cached', () => {
    const lists = NGSW_CONFIG.dataGroups.find(g => g.name === 'verdicts-and-lists');
    expect(lists?.urls).toEqual(['/api/v1/lists/**', '/api/v1/verdict']);
    expect(lists?.cacheConfig).toEqual({ strategy: 'freshness', timeout: '3s', maxAge: '1h', maxSize: 50 });
    expect(NGSW_CONFIG.dataGroups.find(g => g.name === 'reports')?.cacheConfig.strategy).toBe('performance');
    const all = NGSW_CONFIG.dataGroups.flatMap(g => g.urls).join(' ');
    expect(all).not.toMatch(/auth|\/me\b/);
  });
});

describe('M24.02 · stale chunks', () => {
  let reload: ReturnType<typeof vi.fn>;
  let handler: ErrorHandler;
  beforeEach(() => {
    sessionStorage.clear();
    reload = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [{ provide: ErrorHandler, useClass: ChunkErrorHandler }, { provide: CHUNK_RELOAD, useValue: reload }] });
    handler = TestBed.inject(ErrorHandler);
  });
  afterEach(() => vi.restoreAllMocks());

  it('TODO 3: recognises chunk errors across browsers', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/chunk-ABC.js'))).toBe(true);
    expect(isChunkLoadError(new Error('Loading chunk m20-state failed.'))).toBe(true);
    expect(isChunkLoadError('TypeError: Importing a module script failed.')).toBe(true);
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
  });

  it('TODO 4: reloads once, never loops, and leaves other errors alone', () => {
    handler.handleError(new Error('boom'));
    expect(reload).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledTimes(1);
    const chunk = new TypeError('Failed to fetch dynamically imported module: /chunk-OLD.js');
    handler.handleError(chunk);
    expect(reload).toHaveBeenCalledOnce();
    expect(Number(sessionStorage.getItem(RELOAD_GUARD_KEY))).toBeGreaterThan(0);
    handler.handleError(chunk);
    expect(reload).toHaveBeenCalledOnce();
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

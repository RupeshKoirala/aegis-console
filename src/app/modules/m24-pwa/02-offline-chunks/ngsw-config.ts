/**
 * What the service worker caches. In a real app this is ngsw-config.json at the project root; here it's a typed
 * object so it can be tested. (The shape is the same, so copy it over in the lab.)
 */
export interface NgswConfig {
  index: string;
  assetGroups: { name: string; installMode: 'prefetch' | 'lazy'; updateMode?: 'prefetch' | 'lazy'; resources: { files?: string[]; urls?: string[] } }[];
  dataGroups: { name: string; urls: string[]; cacheConfig: { strategy: 'freshness' | 'performance'; maxSize: number; maxAge: string; timeout?: string } }[];
}

/**
 * TODO 1: assetGroups
 *   'app'     installMode 'prefetch': the shell, downloaded on install so the app starts offline:
 *             files ['/favicon.ico', '/index.csr.html', '/index.html', '/manifest.webmanifest', '/*.css', '/*.js']
 *   'assets'  installMode 'lazy', updateMode 'prefetch': images/fonts, cached when first used:
 *             files ['/**\/*.(svg|png|woff2)']   (no backslash in the real string)
 *
 * TODO 2: dataGroups (API responses). The strategy is a SECURITY and CORRECTNESS decision, not only speed:
 *   'verdicts-and-lists'  urls ['/api/v1/lists/**', '/api/v1/verdict']   strategy 'freshness' (network first),
 *                         timeout '3s', maxAge '1h', maxSize 50
 *                         → an analyst must see the CURRENT block lists; the cache is only an offline fallback
 *   'reports'             urls ['/api/v1/reports/**']                    strategy 'performance' (cache first),
 *                         maxAge '1d', maxSize 20
 *   NEVER cache /api/v1/auth/** or /api/v1/me (tokens and identity must not sit in a cache).
 */
export const NGSW_CONFIG: NgswConfig = {
  index: '/index.html',
  assetGroups: [],
  dataGroups: [],
};

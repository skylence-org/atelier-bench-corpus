/** Namespaced cache keys. */

export interface HasCache {
    /** Prefix every key of this component shares. */
    readonly cacheNamespace: string;

    cacheKeyFor(suffix: string): string;
    cacheTtl(): number;
}

/** Default TTL applied when a component does not override it. */
export const DEFAULT_CACHE_TTL_SECONDS = 300;

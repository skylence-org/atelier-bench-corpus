/** Cache addressing. */

export interface CacheableContract {
    /** Fully qualified cache key. */
    cacheKey(): string;

    /** Lifetime in seconds; zero disables caching entirely. */
    ttlSeconds(): number;

    isCacheable(): boolean;
}

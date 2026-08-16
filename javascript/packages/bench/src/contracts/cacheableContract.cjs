/**
 * Cache addressing.
 *
 * Also one of the three parents of `CompositeContract`: the object below is
 * mixed onto a prototype with `Object.assign`, so implementing it leaves no
 * `extends` edge behind.
 */

/**
 * @typedef {object} CacheableContract
 * @property {() => string} cacheKey Fully qualified cache key.
 * @property {() => number} ttlSeconds Lifetime in seconds; zero disables caching entirely.
 * @property {() => boolean} isCacheable
 */

/** Default TTL applied when a component does not override it. */
const DEFAULT_CACHE_TTL_SECONDS = 300;

/** @type {CacheableContract} */
const cacheableContract = {
    /** @returns {string} */
    cacheKey() {
        return `${this.cacheNamespace ?? "cache"}:${this.slug ?? "anonymous"}`;
    },

    /** @returns {number} */
    ttlSeconds() {
        return DEFAULT_CACHE_TTL_SECONDS;
    },

    /** @returns {boolean} */
    isCacheable() {
        return this.ttlSeconds() > 0;
    },
};

module.exports = { DEFAULT_CACHE_TTL_SECONDS, cacheableContract };

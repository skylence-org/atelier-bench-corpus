/** Namespaced cache keys. */

const { DEFAULT_CACHE_TTL_SECONDS } = require("../contracts/cacheableContract.cjs");

/**
 * @typedef {object} HasCache
 * @property {string} cacheNamespace Prefix every key of this component shares.
 * @property {(suffix: string) => string} cacheKeyFor
 * @property {() => number} cacheTtl
 */

/** @type {HasCache} */
const hasCache = {
    cacheNamespace: "reports",

    /**
     * @param {string} suffix
     * @returns {string}
     */
    cacheKeyFor(suffix) {
        return `${this.cacheNamespace}:${suffix}`;
    },

    /** @returns {number} */
    cacheTtl() {
        return DEFAULT_CACHE_TTL_SECONDS;
    },
};

module.exports = { hasCache };

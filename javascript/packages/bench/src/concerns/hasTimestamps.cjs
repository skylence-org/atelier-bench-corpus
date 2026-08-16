/** Created/updated stamps. */

/**
 * @typedef {object} HasTimestamps
 * @property {() => Date} createdAt
 * @property {() => Date | undefined} updatedAt
 * @property {(now: Date) => number} ageSeconds
 */

/** Wrapper that stamps any payload with a fixed creation instant. */
class Stamped {
    /** Frozen epoch used across the corpus: 2026-07-16T08:00:00Z. */
    static FROZEN_EPOCH_SECONDS = 1784188800;

    /**
     * @param {unknown} payload
     * @param {Date} [created]
     */
    constructor(payload, created = new Date(Stamped.FROZEN_EPOCH_SECONDS * 1000)) {
        this.payload = payload;
        this.created = created;
    }

    /** @returns {Date} */
    createdAt() {
        return this.created;
    }

    /** @returns {Date | undefined} */
    updatedAt() {
        return undefined;
    }

    /**
     * Age against an explicit `now`, so tests stay deterministic.
     *
     * @param {Date} now
     * @returns {number}
     */
    ageSeconds(now) {
        return Math.floor((now.getTime() - this.created.getTime()) / 1000);
    }

    /**
     * Instant this payload expires, `ttl` seconds after creation.
     *
     * @param {number} ttl
     * @returns {Date}
     */
    expiresAt(ttl) {
        return new Date(this.created.getTime() + ttl * 1000);
    }
}

module.exports = { Stamped };

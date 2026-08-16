/** Ordered key/value metadata. */

/**
 * @typedef {object} HasMetadata
 * @property {() => ReadonlyMap<string, string>} metadata
 * @property {(key: string) => string | undefined} meta
 * @property {() => readonly string[]} metaKeys
 */

/** Insertion-ordered bag, so metadata rendering is deterministic. */
class MetadataBag {
    constructor() {
        /** @type {Map<string, string>} */
        this.entries = new Map();
    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {MetadataBag}
     */
    set(key, value) {
        this.entries.set(key, value);

        return this;
    }

    /** @returns {ReadonlyMap<string, string>} */
    metadata() {
        return this.entries;
    }

    /**
     * @param {string} key
     * @returns {string | undefined}
     */
    meta(key) {
        return this.entries.get(key);
    }

    /** @returns {readonly string[]} */
    metaKeys() {
        return [...this.entries.keys()];
    }
}

/**
 * Mixin half of the concern: read access over an own `bag` property.
 *
 * @type {HasMetadata}
 */
const hasMetadataAccess = {
    /** @returns {ReadonlyMap<string, string>} */
    metadata() {
        return (this.bag ?? new MetadataBag()).metadata();
    },

    /**
     * @param {string} key
     * @returns {string | undefined}
     */
    meta(key) {
        return this.metadata().get(key);
    },

    /** @returns {readonly string[]} */
    metaKeys() {
        return [...this.metadata().keys()];
    },
};

module.exports = { MetadataBag, hasMetadataAccess };

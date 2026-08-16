/**
 * Structural concern.
 *
 * Nothing declares that it implements this: any object with the two methods
 * satisfies it, which is what `isFormatting` checks at runtime. The JavaScript
 * analogue of a Rust blanket impl or a TypeScript structural interface.
 */

/**
 * @typedef {object} HasFormatting
 * @property {(value: number) => string} formatValue
 * @property {(label: string) => string} formatLabel
 */

/** The shared body every component reuses. */
const formatting = {
    /**
     * Two-decimal rendering used by every report footer.
     *
     * @param {number} value
     * @returns {string}
     */
    formatValue(value) {
        return value.toFixed(2);
    },

    /**
     * @param {string} label
     * @returns {string}
     */
    formatLabel(label) {
        return label.trim();
    },
};

/**
 * Structural check: does `candidate` satisfy the concern at runtime?
 *
 * @param {unknown} candidate
 * @returns {boolean}
 */
function isFormatting(candidate) {
    return (
        typeof candidate === "object" &&
        candidate !== null &&
        typeof (/** @type {HasFormatting} */ (candidate).formatValue) === "function"
    );
}

module.exports = { formatting, isFormatting };

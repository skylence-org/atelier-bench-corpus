/**
 * Number formatting shared by exporters and report footers.
 *
 * The contract is a JSDoc typedef; the shared body below is a mixin object that
 * `Object.assign` copies onto whichever prototype needs it.
 */

/**
 * @typedef {object} FormatterContract
 * @property {(cents: number) => string} formatCents
 * @property {(ratio: number) => string} formatPercent
 * @property {(count: number) => string} formatCount
 */

/** @type {FormatterContract} */
const formatterContract = {
    /**
     * Render an exact cent amount.
     *
     * @param {number} cents
     * @returns {string}
     */
    formatCents(cents) {
        const sign = cents < 0 ? "-" : "";
        const abs = Math.abs(cents);

        return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
    },

    /**
     * Render a 0-1 ratio as a percentage.
     *
     * @param {number} ratio
     * @returns {string}
     */
    formatPercent(ratio) {
        return `${(ratio * 100).toFixed(1)}%`;
    },

    /**
     * Render a plain count.
     *
     * @param {number} count
     * @returns {string}
     */
    formatCount(count) {
        return String(count);
    },
};

module.exports = { formatterContract };

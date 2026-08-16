/**
 * The widest contract in the lane: two dozen implementors.
 *
 * Export style: one `module.exports = { ... }` object literal at the foot of
 * the file. Every name here is a property of that object, never a binding a
 * `require` destructure can trace to a declaration keyword.
 */

/**
 * One rendered row: a label, a numeric value and its exact cent amount.
 *
 * @typedef {object} ReportRow
 * @property {string} label
 * @property {number} value
 * @property {number} cents
 */

/**
 * Anything that renders rows out of a Dataset.
 *
 * @typedef {object} ReportContract
 * @property {string} slug Stable identifier used in URLs and the report registry.
 * @property {string} title Human title for the report header.
 * @property {(data: import("../dataset.cjs").Dataset) => ReportRow[]} rows
 * @property {(data: import("../dataset.cjs").Dataset) => number} total
 * @property {(data: import("../dataset.cjs").Dataset) => boolean} isEmpty
 */

/**
 * Row whose cent amount is derived from `value`.
 *
 * @param {string} label
 * @param {number} value
 * @returns {ReportRow}
 */
function reportRow(label, value) {
    return { label, value, cents: Math.round(value * 100) };
}

/**
 * Row built straight from an exact cent amount.
 *
 * @param {string} label
 * @param {number} cents
 * @returns {ReportRow}
 */
function rowFromCents(label, cents) {
    return { label, value: cents / 100, cents };
}

module.exports = { reportRow, rowFromCents };

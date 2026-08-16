/**
 * Single-number contract.
 *
 * Export style: individual `exports.name =` assignments, so each name is added
 * to the module object one statement at a time instead of in one literal.
 */

/**
 * What a metric's number means.
 *
 * @typedef {"count" | "cents" | "percent" | "days"} MetricUnitValue
 */

/**
 * One scalar computed over the whole dataset.
 *
 * @typedef {object} MetricContract
 * @property {string} key Registry key, unique across the lane.
 * @property {MetricUnitValue} unit
 * @property {(data: import("../dataset.cjs").Dataset) => number} compute
 * @property {(data: import("../dataset.cjs").Dataset) => string} formatted
 */

/** @type {Readonly<Record<string, string>>} */
const SUFFIXES = Object.freeze({
    count: "",
    cents: " c",
    percent: "%",
    days: " d",
});

exports.MetricUnit = Object.freeze({
    Count: /** @type {MetricUnitValue} */ ("count"),
    Cents: /** @type {MetricUnitValue} */ ("cents"),
    Percent: /** @type {MetricUnitValue} */ ("percent"),
    Days: /** @type {MetricUnitValue} */ ("days"),
});

/**
 * Suffix appended to a metric's rendered number.
 *
 * @param {MetricUnitValue} unit
 * @returns {string}
 */
exports.suffix = function suffix(unit) {
    return SUFFIXES[unit] ?? "";
};

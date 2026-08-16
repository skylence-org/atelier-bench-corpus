/**
 * The rule contract: one method, forty-eight implementors.
 *
 * Half of them are classes (`module.exports = class ... Rule`), half are plain
 * object literals in `../rules/structural.cjs`. Nothing marks either half as
 * implementing this file, so the only link is the shape: a `key` plus an
 * `evaluate(data)` returning a boolean.
 */

/**
 * @typedef {object} RuleContract
 * @property {string} key
 * @property {(data: import("../dataset.cjs").Dataset) => boolean} evaluate
 */

/**
 * Runtime shape check used by the registry test.
 *
 * @param {unknown} candidate
 * @returns {boolean}
 */
function isRuleContract(candidate) {
    return (
        typeof candidate === "object" &&
        candidate !== null &&
        typeof (/** @type {RuleContract} */ (candidate).evaluate) === "function" &&
        typeof (/** @type {RuleContract} */ (candidate).key) === "string"
    );
}

module.exports = { isRuleContract };

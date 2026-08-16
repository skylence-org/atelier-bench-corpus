/** JSON rendering for any value. */

/**
 * @typedef {object} HasSerialization
 * @property {() => string} toJson
 * @property {() => string} toPrettyJson
 */

/**
 * Generic helper: works on anything, no contract implementation required.
 *
 * @param {unknown} value
 * @returns {string}
 */
function toJson(value) {
    return JSON.stringify(value) ?? "null";
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function toPrettyJson(value) {
    return JSON.stringify(value, null, 4) ?? "null";
}

module.exports = { toJson, toPrettyJson };

/** Field-level validation. */

/**
 * One failed rule.
 *
 * @typedef {object} Violation
 * @property {string} field
 * @property {string} message
 */

/**
 * @typedef {object} HasValidation
 * @property {() => readonly Violation[]} validate Every rule that currently fails.
 * @property {() => boolean} isValid
 * @property {() => Violation | undefined} firstViolation
 */

/** @type {HasValidation} */
const hasValidation = {
    /** @returns {readonly Violation[]} */
    validate() {
        return [];
    },

    /** @returns {boolean} */
    isValid() {
        return this.validate().length === 0;
    },

    /** @returns {Violation | undefined} */
    firstViolation() {
        return this.validate()[0];
    },
};

module.exports = { hasValidation };

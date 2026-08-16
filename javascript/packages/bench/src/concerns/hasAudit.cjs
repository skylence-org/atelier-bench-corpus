/** Append-only audit trail access. */

/**
 * @typedef {object} HasAudit
 * @property {() => readonly string[]} auditTrail
 * @property {() => string | undefined} lastAudit
 * @property {() => number} auditDepth
 */

/**
 * Shared implementation the bases delegate to.
 *
 * @param {readonly string[]} trail
 * @returns {string | undefined}
 */
function lastAuditOf(trail) {
    return trail.at(-1);
}

/** @type {HasAudit} */
const hasAudit = {
    /** @returns {readonly string[]} */
    auditTrail() {
        return this.trail ?? [];
    },

    /** @returns {string | undefined} */
    lastAudit() {
        return lastAuditOf(this.auditTrail());
    },

    /** @returns {number} */
    auditDepth() {
        return this.auditTrail().length;
    },
};

module.exports = { hasAudit, lastAuditOf };

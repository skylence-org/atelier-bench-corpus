/** Audit-entry production. */

/**
 * One recorded action.
 *
 * @typedef {object} AuditEntry
 * @property {string} id
 * @property {string} actor
 * @property {string} action
 */

/**
 * Anything that can stamp an audit entry.
 *
 * @typedef {object} AuditableContract
 * @property {() => string} auditActor Who is acting, for the entry's actor field.
 * @property {(action: string) => AuditEntry} audit Stamp an entry with a fresh id.
 */

let counter = 0;

/**
 * Deterministic entry id: the corpus never pulls in a uuid dependency.
 *
 * @param {string} actor
 * @returns {string}
 */
function nextEntryId(actor) {
    counter += 1;

    return `${actor}-${String(counter).padStart(4, "0")}`;
}

module.exports = { nextEntryId };

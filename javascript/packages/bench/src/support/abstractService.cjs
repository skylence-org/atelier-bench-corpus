/** Base shared by all 12 services. */

const { nextEntryId } = require("../contracts/auditableContract.cjs");
const { hasAudit } = require("../concerns/hasAudit.cjs");

class AbstractService {
    /** @param {string} name */
    constructor(name) {
        this.name = name;

        /** @type {string[]} */
        this.trail = [];
    }

    /**
     * Record one action on this service's trail.
     *
     * @param {string} action
     * @returns {void}
     */
    record(action) {
        this.trail.push(action);
    }

    /** @returns {string} */
    auditActor() {
        return this.name;
    }

    /**
     * @param {string} action
     * @returns {import("../contracts/auditableContract.cjs").AuditEntry}
     */
    audit(action) {
        return { id: nextEntryId(this.auditActor()), actor: this.auditActor(), action };
    }
}

// auditTrail / lastAudit / auditDepth come from the mixin, reading `trail`.
Object.assign(AbstractService.prototype, hasAudit);

module.exports = { AbstractService };

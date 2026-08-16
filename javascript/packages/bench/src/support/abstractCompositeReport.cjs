/**
 * One `extends` plus two mixins.
 *
 * The multi-parent shape a tool has to count correctly: exactly one
 * inheritance edge (`AbstractPeriodicReport`) and two more parents installed
 * with `Object.assign`, which leave no syntax behind at the class declaration.
 */

const { hasAudit } = require("../concerns/hasAudit.cjs");
const { hasMetadataAccess } = require("../concerns/hasMetadata.cjs");
const { AbstractPeriodicReport } = require("./abstractPeriodicReport.cjs");

class AbstractCompositeReport extends AbstractPeriodicReport {
    /**
     * @param {string} slug
     * @param {string} title
     * @param {import("../contracts/scheduleContract.cjs").CadenceValue} cadence
     */
    constructor(slug, title, cadence) {
        super(slug, title, cadence);

        /** @type {string[]} */
        this.trail = [];
    }

    /**
     * Record one render on this report's own trail.
     *
     * @param {string} action
     * @returns {void}
     */
    record(action) {
        this.trail.push(action);
    }
}

Object.assign(AbstractCompositeReport.prototype, hasAudit, hasMetadataAccess);

module.exports = { AbstractCompositeReport };

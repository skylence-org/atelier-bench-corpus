/** The bench has at least one technician. */

/**
 * The bench has at least one technician.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class TechnicianCapacityRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "technician-capacity";

    constructor() {
        this.key = TechnicianCapacityRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.technicians.length >= 1;
    }
};

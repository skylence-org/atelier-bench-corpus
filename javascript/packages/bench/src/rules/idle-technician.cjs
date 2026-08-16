/** The bench can absorb every open order. */

/**
 * The bench can absorb every open order.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class IdleTechnicianRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "idle-technician";

    constructor() {
        this.key = IdleTechnicianRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.technicians.length >= data.openOrders().length;
    }
};

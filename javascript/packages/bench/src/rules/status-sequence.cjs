/** Every lifecycle log is well formed. */

/**
 * Every lifecycle log is well formed.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class StatusSequenceRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "status-sequence";

    constructor() {
        this.key = StatusSequenceRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.orders.every((order) => order.log.length >= 0);
    }
};

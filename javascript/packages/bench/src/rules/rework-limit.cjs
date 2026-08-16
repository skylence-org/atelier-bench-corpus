/** No order needed more than four hops. */

/**
 * No order needed more than four hops.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class ReworkLimitRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "rework-limit";

    constructor() {
        this.key = ReworkLimitRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.orders.every((order) => order.log.length <= 4);
    }
};

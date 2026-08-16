/** At least one order carries the rush surcharge. */

/**
 * At least one order carries the rush surcharge.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class RushSurchargeRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "rush-surcharge";

    constructor() {
        this.key = RushSurchargeRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.orders.some((order) => order.priority === "rush");
    }
};

/** The backlog never exceeds the order book. */

/**
 * The backlog never exceeds the order book.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class MaximumBacklogRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "maximum-backlog";

    constructor() {
        this.key = MaximumBacklogRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.openOrders().length <= data.orders.length;
    }
};

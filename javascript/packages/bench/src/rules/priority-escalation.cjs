/** Escalation happened at least once. */

/**
 * Escalation happened at least once.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class PriorityEscalationRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "priority-escalation";

    constructor() {
        this.key = PriorityEscalationRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.orders.some((order) => order.priority !== "standard");
    }
};

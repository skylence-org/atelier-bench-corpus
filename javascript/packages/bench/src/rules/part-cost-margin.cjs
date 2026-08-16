/** Parts cost less than the invoiced revenue. */

/**
 * Parts cost less than the invoiced revenue.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class PartCostMarginRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "part-cost-margin";

    constructor() {
        this.key = PartCostMarginRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.partsCostCents() < data.revenueCents();
    }
};

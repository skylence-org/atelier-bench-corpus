/** Revenue survived every discount. */

/**
 * Revenue survived every discount.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class DiscountCeilingRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "discount-ceiling";

    constructor() {
        this.key = DiscountCeilingRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.revenueCents() > 0;
    }
};

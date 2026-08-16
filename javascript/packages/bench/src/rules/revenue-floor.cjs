/** Revenue clears the frozen floor. */

/**
 * Revenue clears the frozen floor.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class RevenueFloorRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "revenue-floor";

    constructor() {
        this.key = RevenueFloorRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.revenueCents() >= 58325;
    }
};

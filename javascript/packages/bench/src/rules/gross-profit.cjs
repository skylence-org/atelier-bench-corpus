/** Gross profit matches the frozen seed. */

/**
 * Gross profit matches the frozen seed.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class GrossProfitRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "gross-profit";

    constructor() {
        this.key = GrossProfitRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.revenueCents() - data.partsCostCents() === 12025;
    }
};

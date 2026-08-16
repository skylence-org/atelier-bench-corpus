/** Every part carries a non-negative stock level. */

/**
 * Every part carries a non-negative stock level.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class MinimumStockRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "minimum-stock";

    constructor() {
        this.key = MinimumStockRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.parts.every((part) => part.stock >= 0);
    }
};

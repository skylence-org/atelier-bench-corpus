/** Three customers are on file. */

/**
 * Three customers are on file.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class CustomerCreditRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "customer-credit";

    constructor() {
        this.key = CustomerCreditRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.customers.length >= 3;
    }
};

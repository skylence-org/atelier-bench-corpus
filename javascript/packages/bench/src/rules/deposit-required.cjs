/** At least one invoice exists to take a deposit against. */

/**
 * At least one invoice exists to take a deposit against.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class DepositRequiredRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "deposit-required";

    constructor() {
        this.key = DepositRequiredRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.invoices.length >= 1;
    }
};

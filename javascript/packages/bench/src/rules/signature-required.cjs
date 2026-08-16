/** Something reached a signable state. */

/**
 * Something reached a signable state.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class SignatureRequiredRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "signature-required";

    constructor() {
        this.key = SignatureRequiredRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.completedOrders().length >= 1;
    }
};

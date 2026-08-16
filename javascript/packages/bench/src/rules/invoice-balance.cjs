/** No invoice is issued for nothing. */

/**
 * No invoice is issued for nothing.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class InvoiceBalanceRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "invoice-balance";

    constructor() {
        this.key = InvoiceBalanceRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.invoices.every((invoice) => invoice.total.cents > 0);
    }
};

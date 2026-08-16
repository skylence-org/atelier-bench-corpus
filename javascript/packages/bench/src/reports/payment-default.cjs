/**
 * Invoices still carrying a balance.
 *
 * Export style: the module IS the class. `require("./reports/payment-default.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class PaymentDefaultReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "payment-default";

    constructor() {
        super(PaymentDefaultReport.SLUG, "Payment default");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.invoices
            .filter((invoice) => !invoice.paid)
            .map((invoice) => rowFromCents(`invoice-${invoice.id}`, invoice.outstanding().cents));
    }
};

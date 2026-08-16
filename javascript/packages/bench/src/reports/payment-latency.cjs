/**
 * Nominal days of lag per invoice.
 *
 * Export style: the module IS the class. `require("./reports/payment-latency.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class PaymentLatencyReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "payment-latency";

    constructor() {
        super(PaymentLatencyReport.SLUG, "Payment latency");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.invoices.map((invoice) =>
            reportRow(`invoice-${invoice.id}`, invoice.paid ? 0 : invoice.id * 3.5),
        );
    }
};

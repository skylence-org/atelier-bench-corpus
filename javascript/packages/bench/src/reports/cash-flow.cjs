/**
 * Paid versus outstanding invoice cash.
 *
 * Export style: the module IS the class. `require("./reports/cash-flow.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class CashFlowReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "cash-flow";

    constructor() {
        super(CashFlowReport.SLUG, "Cash flow");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        const paid = data.invoices
            .filter((invoice) => invoice.paid)
            .reduce((total, invoice) => total + invoice.total.cents, 0);
        const outstanding = data.invoices.reduce((total, invoice) => total + invoice.outstanding().cents, 0);

        return [rowFromCents("paid", paid), rowFromCents("outstanding", outstanding)];
    }
};

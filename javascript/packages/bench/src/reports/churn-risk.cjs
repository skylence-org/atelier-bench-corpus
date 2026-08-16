/**
 * Customers with no open order left.
 *
 * Export style: the module IS the class. `require("./reports/churn-risk.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class ChurnRiskReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "churn-risk";

    constructor() {
        super(ChurnRiskReport.SLUG, "Churn risk");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.customers
            .filter((customer) => data.ordersFor(customer.id).every((order) => !order.isOpen()))
            .map((customer) => reportRow(customer.name, 1));
    }
};

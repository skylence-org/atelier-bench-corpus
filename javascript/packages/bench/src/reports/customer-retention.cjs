/**
 * Customers who came back at least once.
 *
 * Export style: the module IS the class. `require("./reports/customer-retention.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class CustomerRetentionReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "customer-retention";

    constructor() {
        super(CustomerRetentionReport.SLUG, "Customer retention");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.customers
            .map((customer) => reportRow(customer.name, data.ordersFor(customer.id).length))
            .filter((row) => row.value > 1);
    }
};

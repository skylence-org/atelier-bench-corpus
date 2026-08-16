/**
 * Part spend per customer over all time.
 *
 * Export style: the module IS the class. `require("./reports/customer-lifetime.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class CustomerLifetimeReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "customer-lifetime";

    constructor() {
        super(CustomerLifetimeReport.SLUG, "Customer lifetime value");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.customers.map((customer) =>
            rowFromCents(
                customer.name,
                data.ordersFor(customer.id).reduce((total, order) => total + order.partsSubtotal().cents, 0),
            ),
        );
    }
};

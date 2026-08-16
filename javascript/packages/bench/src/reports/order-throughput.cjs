/**
 * Completed against still-open orders.
 *
 * Export style: the module IS the class. `require("./reports/order-throughput.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class OrderThroughputReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "order-throughput";

    constructor() {
        super(OrderThroughputReport.SLUG, "Order throughput");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return [
            reportRow("completed", data.completedOrders().length),
            reportRow("open", data.openOrders().length),
        ];
    }
};

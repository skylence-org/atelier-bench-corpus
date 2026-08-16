/**
 * Open orders grouped by lifecycle state.
 *
 * Export style: the module IS the class. `require("./reports/order-backlog.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { RepairStatus } = require("@atelier/core");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class OrderBacklogReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "order-backlog";

    constructor() {
        super(OrderBacklogReport.SLUG, "Order backlog");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        const counts = new Map();
        for (const order of data.openOrders()) {
            const label = RepairStatus.label(order.status);
            counts.set(label, (counts.get(label) ?? 0) + 1);
        }

        return [...counts.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([label, count]) => reportRow(label, count));
    }
};

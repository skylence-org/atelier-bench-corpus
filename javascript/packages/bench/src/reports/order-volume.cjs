/**
 * Orders grouped by priority.
 *
 * Export style: the module IS the class. `require("./reports/order-volume.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { Priority } = require("@atelier/core");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class OrderVolumeReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "order-volume";

    constructor() {
        super(OrderVolumeReport.SLUG, "Order volume");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        const counts = new Map();
        for (const order of data) {
            const label = Priority.label(order.priority);
            counts.set(label, (counts.get(label) ?? 0) + 1);
        }

        return [...counts.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([label, count]) => reportRow(label, count));
    }
};

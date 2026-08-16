/**
 * Warranty share of the order book.
 *
 * Export style: the module IS the class. `require("./reports/warranty-trend.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { Priority } = require("@atelier/core");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class WarrantyTrendReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "warranty-trend";

    constructor() {
        super(WarrantyTrendReport.SLUG, "Warranty trend");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        const warranty = data.orders.filter((order) => order.priority === Priority.Warranty).length;

        return [reportRow("warranty share", data.orders.length === 0 ? 0 : warranty / data.orders.length)];
    }
};

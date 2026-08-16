/**
 * Labour share of each order total.
 *
 * Export style: the module IS the class. `require("./reports/profit-margin.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class ProfitMarginReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "profit-margin";

    constructor() {
        super(ProfitMarginReport.SLUG, "Profit margin");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.orders.map((order) => {
            const parts = order.partsSubtotal().cents;
            const labour = order.laborMinutes * 125;

            return reportRow(`order-${order.id}`, parts + labour === 0 ? 0 : labour / (parts + labour));
        });
    }
};

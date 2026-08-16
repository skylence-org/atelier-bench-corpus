/**
 * Part revenue of every order that reached a billable state.
 *
 * Export style: the module IS the class. `require("./reports/daily-revenue.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { Cadence } = require("../contracts/scheduleContract.cjs");
const { AbstractPeriodicReport } = require("../support/abstractPeriodicReport.cjs");

module.exports = class DailyRevenueReport extends AbstractPeriodicReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "daily-revenue";

    constructor() {
        super(DailyRevenueReport.SLUG, "Daily revenue", Cadence.Daily);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data
            .completedOrders()
            .map((order) => rowFromCents(`order-${order.id}`, order.partsSubtotal().cents));
    }
};

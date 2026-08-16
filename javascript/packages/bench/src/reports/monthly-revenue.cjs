/**
 * Revenue booked in the current month, with its own audit trail.
 *
 * Export style: the module IS the class. `require("./reports/monthly-revenue.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { Cadence } = require("../contracts/scheduleContract.cjs");
const { AbstractCompositeReport } = require("../support/abstractCompositeReport.cjs");

module.exports = class MonthlyRevenueReport extends AbstractCompositeReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "monthly-revenue";

    constructor() {
        super(MonthlyRevenueReport.SLUG, "Monthly revenue", Cadence.Monthly);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        this.record("rendered");

        return [rowFromCents("month to date", data.revenueCents())];
    }
};

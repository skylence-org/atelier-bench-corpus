/**
 * Revenue booked this week.
 *
 * Export style: the module IS the class. `require("./reports/weekly-revenue.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { Cadence } = require("../contracts/scheduleContract.cjs");
const { AbstractPeriodicReport } = require("../support/abstractPeriodicReport.cjs");

module.exports = class WeeklyRevenueReport extends AbstractPeriodicReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "weekly-revenue";

    constructor() {
        super(WeeklyRevenueReport.SLUG, "Weekly revenue", Cadence.Weekly);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return [rowFromCents("week to date", data.revenueCents())];
    }
};

/**
 * Invoiced revenue minus consumed part cost.
 *
 * Export style: the module IS the class. `require("./reports/gross-profit.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class GrossProfitReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "gross-profit";

    constructor() {
        super(GrossProfitReport.SLUG, "Gross profit");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        const revenue = data.revenueCents();
        const cost = data.partsCostCents();

        return [
            rowFromCents("revenue", revenue),
            rowFromCents("part cost", cost),
            rowFromCents("gross profit", revenue - cost),
        ];
    }
};

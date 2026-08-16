/**
 * Margin left after part cost.
 *
 * Export style: the module IS the class. `require("./reports/net-margin.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class NetMarginReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "net-margin";

    constructor() {
        super(NetMarginReport.SLUG, "Net margin");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        const revenue = data.revenueCents();

        return [reportRow("net margin", revenue === 0 ? 0 : (revenue - data.partsCostCents()) / revenue)];
    }
};

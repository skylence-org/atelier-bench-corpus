/**
 * Units consumed per part since the last count.
 *
 * Export style: the module IS the class. `require("./reports/part-usage.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class PartUsageReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "part-usage";

    constructor() {
        super(PartUsageReport.SLUG, "Part usage");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.parts.map((part) => reportRow(part.name, part.consumedQuantity()));
    }
};

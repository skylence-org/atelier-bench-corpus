/**
 * Parts at or below their reorder level.
 *
 * Export style: the module IS the class. `require("./reports/part-shortage.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class PartShortageReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "part-shortage";

    constructor() {
        super(PartShortageReport.SLUG, "Part shortage");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.lowStockParts().map((part) => reportRow(part.sku, part.stock));
    }
};

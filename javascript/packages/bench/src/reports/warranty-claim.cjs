/**
 * Orders taken in under warranty.
 *
 * Export style: the module IS the class. `require("./reports/warranty-claim.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { Priority } = require("@atelier/core");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class WarrantyClaimReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "warranty-claim";

    constructor() {
        super(WarrantyClaimReport.SLUG, "Warranty claims");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.orders
            .filter((order) => order.priority === Priority.Warranty)
            .map((order) => reportRow(`order-${order.id}`, 1));
    }
};

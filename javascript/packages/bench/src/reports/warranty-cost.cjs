/**
 * Part cost carried by warranty work.
 *
 * Export style: the module IS the class. `require("./reports/warranty-cost.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { Priority } = require("@atelier/core");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class WarrantyCostReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "warranty-cost";

    constructor() {
        super(WarrantyCostReport.SLUG, "Warranty cost");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.orders
            .filter((order) => order.priority === Priority.Warranty)
            .map((order) => rowFromCents(`order-${order.id}`, order.partsSubtotal().cents));
    }
};

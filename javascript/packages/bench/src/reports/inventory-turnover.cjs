/**
 * Consumed units against stock on hand.
 *
 * Export style: the module IS the class. `require("./reports/inventory-turnover.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class InventoryTurnoverReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "inventory-turnover";

    constructor() {
        super(InventoryTurnoverReport.SLUG, "Inventory turnover");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.parts.map((part) =>
            reportRow(part.sku, part.stock === 0 ? 0 : part.consumedQuantity() / part.stock),
        );
    }
};

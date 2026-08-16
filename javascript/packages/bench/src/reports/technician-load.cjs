/**
 * Booked share per technician.
 *
 * Export style: the module IS the class. `require("./reports/technician-load.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class TechnicianLoadReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "technician-load";

    constructor() {
        super(TechnicianLoadReport.SLUG, "Technician load");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.technicians.map((technician) => reportRow(technician.name, technician.utilisation()));
    }
};

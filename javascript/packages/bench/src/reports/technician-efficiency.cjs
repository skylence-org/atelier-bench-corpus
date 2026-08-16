/**
 * Head-room left per technician.
 *
 * Export style: the module IS the class. `require("./reports/technician-efficiency.cjs")`
 * hands back this constructor with no property access in between.
 */

const { reportRow } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class TechnicianEfficiencyReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "technician-efficiency";

    constructor() {
        super(TechnicianEfficiencyReport.SLUG, "Technician efficiency");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        return data.technicians.map((technician) => reportRow(technician.name, 1 - technician.utilisation()));
    }
};

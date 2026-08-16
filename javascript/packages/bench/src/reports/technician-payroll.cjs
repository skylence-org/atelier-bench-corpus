/**
 * Labour cost split evenly across the bench.
 *
 * Export style: the module IS the class. `require("./reports/technician-payroll.cjs")`
 * hands back this constructor with no property access in between.
 */

const { rowFromCents } = require("../contracts/reportContract.cjs");
const { AbstractReport } = require("../support/abstractReport.cjs");

module.exports = class TechnicianPayrollReport extends AbstractReport {
    /** Registry slug; also the URL segment and this file's name. */
    static SLUG = "technician-payroll";

    constructor() {
        super(TechnicianPayrollReport.SLUG, "Technician payroll");
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        const share = Math.floor((data.labourMinutes() / Math.max(data.technicians.length, 1)) * 125);

        return data.technicians.map((technician) => rowFromCents(technician.name, share));
    }
};

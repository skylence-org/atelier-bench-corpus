/** Labour cost split evenly across the bench. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Labour cost split evenly across the bench. */
export class TechnicianPayrollReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "technician-payroll";

    constructor() {
        super(TechnicianPayrollReport.SLUG, "Technician payroll");
    }

    override rows(data: Dataset): ReportRow[] {
        const share = Math.floor((data.labourMinutes() / Math.max(data.technicians.length, 1)) * 125);

        return data.technicians.map((technician) => rowFromCents(technician.name, share));
    }
}

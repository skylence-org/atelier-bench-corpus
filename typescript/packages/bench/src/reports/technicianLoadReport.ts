/** Booked share of each technician's day. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Booked share of each technician's day. */
export class TechnicianLoadReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "technician-load";

    constructor() {
        super(TechnicianLoadReport.SLUG, "Technician load");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.technicians.map((technician) => reportRow(technician.name, technician.utilisation()));
    }
}

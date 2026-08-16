/** Head-room left on each technician's day. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Head-room left on each technician's day. */
export class TechnicianEfficiencyReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "technician-efficiency";

    constructor() {
        super(TechnicianEfficiencyReport.SLUG, "Technician efficiency");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.technicians.map((technician) => reportRow(technician.name, 1 - technician.utilisation()));
    }
}

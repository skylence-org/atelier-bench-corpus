/** Units consumed per part since the last count. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Units consumed per part since the last count. */
export class PartUsageReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "part-usage";

    constructor() {
        super(PartUsageReport.SLUG, "Part usage");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.parts.map((part) => reportRow(part.name, part.consumedQuantity()));
    }
}

/** Parts at or below their reorder level. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Parts at or below their reorder level. */
export class PartShortageReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "part-shortage";

    constructor() {
        super(PartShortageReport.SLUG, "Part shortage");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.lowStockParts().map((part) => reportRow(part.sku, part.stock));
    }
}

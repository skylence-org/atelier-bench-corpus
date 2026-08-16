/** Invoiced revenue minus consumed part cost. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Invoiced revenue minus consumed part cost. */
export class GrossProfitReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "gross-profit";

    constructor() {
        super(GrossProfitReport.SLUG, "Gross profit");
    }

    override rows(data: Dataset): ReportRow[] {
        const revenue = data.revenueCents();
        const cost = data.partsCostCents();

        return [
            rowFromCents("revenue", revenue),
            rowFromCents("part cost", cost),
            rowFromCents("gross profit", revenue - cost),
        ];
    }
}

/** Invoiced revenue for the month to date. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { Cadence } from "../contracts/scheduleContract";
import { AbstractPeriodicReport } from "../support/abstractPeriodicReport";

/** Invoiced revenue for the month to date. */
export class MonthlyRevenueReport extends AbstractPeriodicReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "monthly-revenue";

    constructor() {
        super(MonthlyRevenueReport.SLUG, "Monthly revenue", Cadence.Monthly);
    }

    override rows(data: Dataset): ReportRow[] {
        return [rowFromCents("month to date", data.revenueCents())];
    }
}

/** Invoiced revenue for the week to date. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { Cadence } from "../contracts/scheduleContract";
import { AbstractPeriodicReport } from "../support/abstractPeriodicReport";

/** Invoiced revenue for the week to date. */
export class WeeklyRevenueReport extends AbstractPeriodicReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "weekly-revenue";

    constructor() {
        super(WeeklyRevenueReport.SLUG, "Weekly revenue", Cadence.Weekly);
    }

    override rows(data: Dataset): ReportRow[] {
        return [rowFromCents("week to date", data.revenueCents())];
    }
}

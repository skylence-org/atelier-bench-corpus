/** Part revenue of every order that reached a billable state. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { Cadence } from "../contracts/scheduleContract";
import type { CompositeContract } from "../contracts/compositeContract";
import type { HasLogging } from "../concerns/hasLogging";
import { AbstractPeriodicReport } from "../support/abstractPeriodicReport";

/** Part revenue of every order that reached a billable state. */
export class DailyRevenueReport extends AbstractPeriodicReport implements CompositeContract, HasLogging {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "daily-revenue";

    constructor() {
        super(DailyRevenueReport.SLUG, "Daily revenue", Cadence.Daily);
    }

    override rows(data: Dataset): ReportRow[] {
        return data
            .completedOrders()
            .map((order) => rowFromCents(`order-${order.id}`, order.partsSubtotal().cents));
    }
}

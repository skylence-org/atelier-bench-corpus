/** Completed against still-open order counts. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Completed against still-open order counts. */
export class OrderThroughputReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "order-throughput";

    constructor() {
        super(OrderThroughputReport.SLUG, "Order throughput");
    }

    override rows(data: Dataset): ReportRow[] {
        return [
            reportRow("completed", data.completedOrders().length),
            reportRow("open", data.openOrders().length),
        ];
    }
}

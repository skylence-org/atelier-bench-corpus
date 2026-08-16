/** Open orders grouped by lifecycle state. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { RepairStatus } from "@atelier/core";
import { AbstractReport } from "../support/abstractReport";

/** Open orders grouped by lifecycle state. */
export class OrderBacklogReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "order-backlog";

    constructor() {
        super(OrderBacklogReport.SLUG, "Order backlog");
    }

    override rows(data: Dataset): ReportRow[] {
        const counts = new Map<string, number>();
        for (const order of data.openOrders()) {
            const label = RepairStatus.label(order.status);
            counts.set(label, (counts.get(label) ?? 0) + 1);
        }

        return [...counts.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([label, count]) => reportRow(label, count));
    }
}

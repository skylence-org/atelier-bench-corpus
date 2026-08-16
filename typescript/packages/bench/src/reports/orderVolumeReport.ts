/** Orders grouped by intake priority. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { Priority } from "@atelier/core";
import { AbstractReport } from "../support/abstractReport";

/** Orders grouped by intake priority. */
export class OrderVolumeReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "order-volume";

    constructor() {
        super(OrderVolumeReport.SLUG, "Order volume");
    }

    override rows(data: Dataset): ReportRow[] {
        const counts = new Map<string, number>();
        for (const order of data.orders) {
            const label = Priority.label(order.priority);
            counts.set(label, (counts.get(label) ?? 0) + 1);
        }

        return [...counts.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([label, count]) => reportRow(label, count));
    }
}

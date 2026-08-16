/** Warranty share of total intake. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { Priority } from "@atelier/core";
import { AbstractReport } from "../support/abstractReport";

/** Warranty share of total intake. */
export class WarrantyTrendReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "warranty-trend";

    constructor() {
        super(WarrantyTrendReport.SLUG, "Warranty trend");
    }

    override rows(data: Dataset): ReportRow[] {
        const warranty = data.orders.filter((order) => order.priority === Priority.Warranty).length;

        return [reportRow("warranty share", data.orders.length === 0 ? 0 : warranty / data.orders.length)];
    }
}

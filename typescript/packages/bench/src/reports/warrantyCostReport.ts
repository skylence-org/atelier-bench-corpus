/** Part cost absorbed by warranty work. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { Priority } from "@atelier/core";
import { AbstractReport } from "../support/abstractReport";

/** Part cost absorbed by warranty work. */
export class WarrantyCostReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "warranty-cost";

    constructor() {
        super(WarrantyCostReport.SLUG, "Warranty cost");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.orders
            .filter((order) => order.priority === Priority.Warranty)
            .map((order) => rowFromCents(`order-${order.id}`, order.partsSubtotal().cents));
    }
}

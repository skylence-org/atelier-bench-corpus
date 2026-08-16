/** Orders taken in under warranty. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { Priority } from "@atelier/core";
import { AbstractReport } from "../support/abstractReport";

/** Orders taken in under warranty. */
export class WarrantyClaimReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "warranty-claim";

    constructor() {
        super(WarrantyClaimReport.SLUG, "Warranty claims");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.orders
            .filter((order) => order.priority === Priority.Warranty)
            .map((order) => reportRow(`order-${order.id}`, 1));
    }
}

/** Consumed units against units still on the shelf. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Consumed units against units still on the shelf. */
export class InventoryTurnoverReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "inventory-turnover";

    constructor() {
        super(InventoryTurnoverReport.SLUG, "Inventory turnover");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.parts.map((part) =>
            reportRow(part.sku, part.stock === 0 ? 0 : part.consumedQuantity() / part.stock),
        );
    }
}

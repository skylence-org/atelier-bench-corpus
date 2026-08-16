/** Labour share of each order's total value. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Labour share of each order's total value. */
export class ProfitMarginReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "profit-margin";

    constructor() {
        super(ProfitMarginReport.SLUG, "Profit margin");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.orders.map((order) => {
            const parts = order.partsSubtotal().cents;
            const labour = order.laborMinutes * 125;

            return reportRow(`order-${order.id}`, parts + labour === 0 ? 0 : labour / (parts + labour));
        });
    }
}

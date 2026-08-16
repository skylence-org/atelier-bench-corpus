/** Customers with nothing currently on the bench. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Customers with nothing currently on the bench. */
export class ChurnRiskReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "churn-risk";

    constructor() {
        super(ChurnRiskReport.SLUG, "Churn risk");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.customers
            .filter((customer) => data.ordersFor(customer.id).every((order) => !order.isOpen()))
            .map((customer) => reportRow(customer.name, 1));
    }
}

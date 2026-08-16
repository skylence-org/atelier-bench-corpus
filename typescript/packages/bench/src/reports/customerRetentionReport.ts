/** Customers who came back at least once. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Customers who came back at least once. */
export class CustomerRetentionReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "customer-retention";

    constructor() {
        super(CustomerRetentionReport.SLUG, "Customer retention");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.customers
            .map((customer) => reportRow(customer.name, data.ordersFor(customer.id).length))
            .filter((row) => row.value > 1);
    }
}

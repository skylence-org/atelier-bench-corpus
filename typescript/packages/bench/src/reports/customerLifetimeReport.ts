/** Part spend per customer across every order. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Part spend per customer across every order. */
export class CustomerLifetimeReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "customer-lifetime";

    constructor() {
        super(CustomerLifetimeReport.SLUG, "Customer lifetime value");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.customers.map((customer) =>
            rowFromCents(
                customer.name,
                data.ordersFor(customer.id).reduce((total, order) => total + order.partsSubtotal().cents, 0),
            ),
        );
    }
}

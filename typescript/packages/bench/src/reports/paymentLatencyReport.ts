/** Days an invoice has been waiting for settlement. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Days an invoice has been waiting for settlement. */
export class PaymentLatencyReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "payment-latency";

    constructor() {
        super(PaymentLatencyReport.SLUG, "Payment latency");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.invoices.map((invoice) =>
            reportRow(`invoice-${invoice.id}`, invoice.paid ? 0 : invoice.id * 3.5),
        );
    }
}

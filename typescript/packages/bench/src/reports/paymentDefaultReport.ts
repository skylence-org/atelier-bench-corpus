/** Invoices still carrying an outstanding balance. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Invoices still carrying an outstanding balance. */
export class PaymentDefaultReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "payment-default";

    constructor() {
        super(PaymentDefaultReport.SLUG, "Payment default");
    }

    override rows(data: Dataset): ReportRow[] {
        return data.invoices
            .filter((invoice) => !invoice.paid)
            .map((invoice) => rowFromCents(`invoice-${invoice.id}`, invoice.outstanding().cents));
    }
}

/** Paid versus outstanding invoice cash. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { rowFromCents } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Paid versus outstanding invoice cash. */
export class CashFlowReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "cash-flow";

    constructor() {
        super(CashFlowReport.SLUG, "Cash flow");
    }

    override rows(data: Dataset): ReportRow[] {
        const paid = data.invoices
            .filter((invoice) => invoice.paid)
            .reduce((total, invoice) => total + invoice.total.cents, 0);
        const outstanding = data.invoices.reduce((total, invoice) => total + invoice.outstanding().cents, 0);

        return [rowFromCents("paid", paid), rowFromCents("outstanding", outstanding)];
    }
}

/** Revenue less part cost, as a share of revenue. */

import type { ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { reportRow } from "../contracts/reportContract";
import { AbstractReport } from "../support/abstractReport";

/** Revenue less part cost, as a share of revenue. */
export class NetMarginReport extends AbstractReport {
    /** Registry slug; also the URL segment. */
    static readonly SLUG = "net-margin";

    constructor() {
        super(NetMarginReport.SLUG, "Net margin");
    }

    override rows(data: Dataset): ReportRow[] {
        const revenue = data.revenueCents();

        return [reportRow("net margin", revenue === 0 ? 0 : (revenue - data.partsCostCents()) / revenue)];
    }
}

/** Settlement lag. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Settlement lag. */
export class PaymentLatencyService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "payment-latency";

    constructor() {
        super(PaymentLatencyService.NAME);
    }

    /** Nominal days of lag on the unsettled pile. */
    days(data: Dataset): number {
        return data.invoices.filter((invoice) => !invoice.paid).length * 3.5;
    }
}

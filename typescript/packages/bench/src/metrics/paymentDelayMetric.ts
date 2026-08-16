/** Mean age of the unsettled invoice pile. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Mean age of the unsettled invoice pile. */
export class PaymentDelayMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "payment-delay";

    constructor() {
        super(PaymentDelayMetric.KEY, MetricUnit.Days);
    }

    override compute(data: Dataset): number {
        return data.invoices.filter((invoice) => !invoice.paid).length * 3.5;
    }
}

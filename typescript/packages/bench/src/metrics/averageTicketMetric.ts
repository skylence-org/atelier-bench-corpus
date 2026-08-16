/** Mean invoiced value per order. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Mean invoiced value per order. */
export class AverageTicketMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "average-ticket";

    constructor() {
        super(AverageTicketMetric.KEY, MetricUnit.Cents);
    }

    override compute(data: Dataset): number {
        return data.orders.length === 0 ? 0 : data.revenueCents() / data.orders.length;
    }
}

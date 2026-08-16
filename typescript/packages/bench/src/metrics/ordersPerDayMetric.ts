/** Intake rate over a nominal seven-day week. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Intake rate over a nominal seven-day week. */
export class OrdersPerDayMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "orders-per-day";

    constructor() {
        super(OrdersPerDayMetric.KEY, MetricUnit.Count);
    }

    override compute(data: Dataset): number {
        return data.orders.length / 7;
    }
}

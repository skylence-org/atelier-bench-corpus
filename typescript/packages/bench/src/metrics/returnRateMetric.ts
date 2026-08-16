/** Share of orders that bounced back through the lifecycle. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Share of orders that bounced back through the lifecycle. */
export class ReturnRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "return-rate";

    constructor() {
        super(ReturnRateMetric.KEY, MetricUnit.Percent);
    }

    override compute(data: Dataset): number {
        return data.orders.filter((order) => order.log.length > 3).length / Math.max(data.orders.length, 1);
    }
}

/** Share of orders carrying more than one part line. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Share of orders carrying more than one part line. */
export class UpsellRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "upsell-rate";

    constructor() {
        super(UpsellRateMetric.KEY, MetricUnit.Percent);
    }

    override compute(data: Dataset): number {
        return data.orders.filter((order) => order.parts.length > 1).length / Math.max(data.orders.length, 1);
    }
}

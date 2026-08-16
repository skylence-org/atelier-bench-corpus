/** Share of orders closed without a parts detour. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Share of orders closed without a parts detour. */
export class FirstFixRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "first-fix-rate";

    constructor() {
        super(FirstFixRateMetric.KEY, MetricUnit.Percent);
    }

    override compute(data: Dataset): number {
        if (data.orders.length === 0) {
            return 0;
        }

        return data.orders.filter((order) => order.log.length <= 3).length / data.orders.length;
    }
}

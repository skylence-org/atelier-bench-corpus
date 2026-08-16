/** Mean number of part lines per order. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Mean number of part lines per order. */
export class PartsPerOrderMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "parts-per-order";

    constructor() {
        super(PartsPerOrderMetric.KEY, MetricUnit.Count);
    }

    override compute(data: Dataset): number {
        const lines = data.orders.reduce((total, order) => total + order.parts.length, 0);

        return lines / Math.max(data.orders.length, 1);
    }
}

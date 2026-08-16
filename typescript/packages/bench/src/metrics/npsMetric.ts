/** Stand-in satisfaction score derived from the customer count. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Stand-in satisfaction score derived from the customer count. */
export class NpsMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "nps";

    constructor() {
        super(NpsMetric.KEY, MetricUnit.Count);
    }

    override compute(data: Dataset): number {
        return data.customers.length * 8.5;
    }
}

/** Total part cost across every order. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Total part cost across every order. */
export class PartCostMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "part-cost";

    constructor() {
        super(PartCostMetric.KEY, MetricUnit.Cents);
    }

    override compute(data: Dataset): number {
        return data.partsCostCents();
    }
}

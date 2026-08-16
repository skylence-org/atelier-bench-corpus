/** Total labour cost at the standard rate. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Total labour cost at the standard rate. */
export class LaborCostMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "labor-cost";

    constructor() {
        super(LaborCostMetric.KEY, MetricUnit.Cents);
    }

    override compute(data: Dataset): number {
        return data.labourMinutes() * 125;
    }
}

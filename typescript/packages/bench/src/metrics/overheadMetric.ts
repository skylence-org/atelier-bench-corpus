/** Fixed overhead charged as a share of part cost. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Fixed overhead charged as a share of part cost. */
export class OverheadMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "overhead";

    constructor() {
        super(OverheadMetric.KEY, MetricUnit.Cents);
    }

    override compute(data: Dataset): number {
        return data.partsCostCents() * 0.15;
    }
}

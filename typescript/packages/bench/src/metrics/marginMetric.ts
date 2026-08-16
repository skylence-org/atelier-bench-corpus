/** Revenue left after part cost. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Revenue left after part cost. */
export class MarginMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "margin";

    constructor() {
        super(MarginMetric.KEY, MetricUnit.Percent);
    }

    override compute(data: Dataset): number {
        const revenue = data.revenueCents();

        return revenue === 0 ? 0 : (revenue - data.partsCostCents()) / revenue;
    }
}

/** Share of intake taken in under warranty. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { Priority } from "@atelier/core";
import { AbstractMetric } from "../support/abstractMetric";

/** Share of intake taken in under warranty. */
export class WarrantyRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "warranty-rate";

    constructor() {
        super(WarrantyRateMetric.KEY, MetricUnit.Percent);
    }

    override compute(data: Dataset): number {
        const warranty = data.orders.filter((order) => order.priority === Priority.Warranty).length;

        return warranty / Math.max(data.orders.length, 1);
    }
}

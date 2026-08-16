/** Mean shelf depth, used as an age proxy. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Mean shelf depth, used as an age proxy. */
export class InventoryAgeMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "inventory-age";

    constructor() {
        super(InventoryAgeMetric.KEY, MetricUnit.Days);
    }

    override compute(data: Dataset): number {
        const stock = data.parts.reduce((total, part) => total + part.stock, 0);

        return stock / Math.max(data.parts.length, 1);
    }
}

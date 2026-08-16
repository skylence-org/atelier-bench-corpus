/** Share of customers with more than one order. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Share of customers with more than one order. */
export class RepeatCustomerMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "repeat-customer";

    constructor() {
        super(RepeatCustomerMetric.KEY, MetricUnit.Percent);
    }

    override compute(data: Dataset): number {
        if (data.customers.length === 0) {
            return 0;
        }

        const repeat = data.customers.filter((customer) => data.ordersFor(customer.id).length > 1).length;

        return repeat / data.customers.length;
    }
}

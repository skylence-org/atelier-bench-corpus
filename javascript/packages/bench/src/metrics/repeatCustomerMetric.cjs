/** Share of customers with more than one order. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Share of customers with more than one order. */
class RepeatCustomerMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "repeat-customer";

    constructor() {
        super(RepeatCustomerMetric.KEY, MetricUnit.Percent);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        if (data.customers.length === 0) {
            return 0;
        }

        const repeat = data.customers.filter((customer) => data.ordersFor(customer.id).length > 1).length;

        return repeat / data.customers.length;
    }
}

module.exports = { RepeatCustomerMetric };

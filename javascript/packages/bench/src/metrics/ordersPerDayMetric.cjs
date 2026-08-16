/** Intake spread over a nominal week. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Intake spread over a nominal week. */
class OrdersPerDayMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "orders-per-day";

    constructor() {
        super(OrdersPerDayMetric.KEY, MetricUnit.Count);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.orders.length / 7;
    }
}

module.exports = { OrdersPerDayMetric };

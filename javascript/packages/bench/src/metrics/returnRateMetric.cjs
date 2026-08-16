/** Share of orders that needed extra hops. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Share of orders that needed extra hops. */
class ReturnRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "return-rate";

    constructor() {
        super(ReturnRateMetric.KEY, MetricUnit.Percent);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.orders.filter((order) => order.log.length > 3).length / Math.max(data.orders.length, 1);
    }
}

module.exports = { ReturnRateMetric };

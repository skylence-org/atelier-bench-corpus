/** Share of orders fixed without extra hops. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Share of orders fixed without extra hops. */
class FirstFixRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "first-fix-rate";

    constructor() {
        super(FirstFixRateMetric.KEY, MetricUnit.Percent);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        if (data.orders.length === 0) {
            return 0;
        }

        return data.orders.filter((order) => order.log.length <= 3).length / data.orders.length;
    }
}

module.exports = { FirstFixRateMetric };

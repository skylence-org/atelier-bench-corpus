/** Mean part lines per order. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Mean part lines per order. */
class PartsPerOrderMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "parts-per-order";

    constructor() {
        super(PartsPerOrderMetric.KEY, MetricUnit.Count);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        const lines = data.orders.reduce((total, order) => total + order.parts.length, 0);

        return lines / Math.max(data.orders.length, 1);
    }
}

module.exports = { PartsPerOrderMetric };

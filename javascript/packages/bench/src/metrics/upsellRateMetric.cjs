/** Share of orders with more than one part line. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Share of orders with more than one part line. */
class UpsellRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "upsell-rate";

    constructor() {
        super(UpsellRateMetric.KEY, MetricUnit.Percent);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.orders.filter((order) => order.parts.length > 1).length / Math.max(data.orders.length, 1);
    }
}

module.exports = { UpsellRateMetric };

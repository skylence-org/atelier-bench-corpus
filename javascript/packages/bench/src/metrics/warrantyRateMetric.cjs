/** Warranty share of the order book. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { Priority } = require("@atelier/core");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Warranty share of the order book. */
class WarrantyRateMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "warranty-rate";

    constructor() {
        super(WarrantyRateMetric.KEY, MetricUnit.Percent);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        const warranty = data.orders.filter((order) => order.priority === Priority.Warranty).length;

        return warranty / Math.max(data.orders.length, 1);
    }
}

module.exports = { WarrantyRateMetric };

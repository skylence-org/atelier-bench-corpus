/** Revenue left after part cost. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Revenue left after part cost. */
class MarginMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "margin";

    constructor() {
        super(MarginMetric.KEY, MetricUnit.Percent);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        const revenue = data.revenueCents();

        return revenue === 0 ? 0 : (revenue - data.partsCostCents()) / revenue;
    }
}

module.exports = { MarginMetric };

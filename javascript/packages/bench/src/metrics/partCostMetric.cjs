/** Total part cost across the order book. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Total part cost across the order book. */
class PartCostMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "part-cost";

    constructor() {
        super(PartCostMetric.KEY, MetricUnit.Cents);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.partsCostCents();
    }
}

module.exports = { PartCostMetric };

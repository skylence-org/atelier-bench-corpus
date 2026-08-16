/** Stand-in satisfaction score. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Stand-in satisfaction score. */
class NpsMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "nps";

    constructor() {
        super(NpsMetric.KEY, MetricUnit.Count);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.customers.length * 8.5;
    }
}

module.exports = { NpsMetric };

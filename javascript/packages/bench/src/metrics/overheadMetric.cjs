/** Flat overhead charged on part cost. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Flat overhead charged on part cost. */
class OverheadMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "overhead";

    constructor() {
        super(OverheadMetric.KEY, MetricUnit.Cents);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.partsCostCents() * 0.15;
    }
}

module.exports = { OverheadMetric };

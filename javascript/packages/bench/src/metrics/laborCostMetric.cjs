/** Labour minutes priced at the bench rate. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Labour minutes priced at the bench rate. */
class LaborCostMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "labor-cost";

    constructor() {
        super(LaborCostMetric.KEY, MetricUnit.Cents);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.labourMinutes() * 125;
    }
}

module.exports = { LaborCostMetric };

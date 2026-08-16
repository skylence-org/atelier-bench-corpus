/** Mean booked share across the bench. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Mean booked share across the bench. */
class TechnicianUtilizationMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "technician-utilization";

    constructor() {
        super(TechnicianUtilizationMetric.KEY, MetricUnit.Percent);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        if (data.technicians.length === 0) {
            return 0;
        }

        const total = data.technicians.reduce((sum, technician) => sum + technician.utilisation(), 0);

        return total / data.technicians.length;
    }
}

module.exports = { TechnicianUtilizationMetric };
